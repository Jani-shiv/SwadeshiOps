package pipeline

import (
	"fmt"

	"gopkg.in/yaml.v3"
)

// PipelineConfig represents the parsed pipeline YAML configuration
type PipelineConfig struct {
	Version  string                  `yaml:"version" json:"version"`
	Pipeline PipelineSpec            `yaml:"pipeline" json:"pipeline"`
}

type PipelineSpec struct {
	Name          string                 `yaml:"name" json:"name"`
	Env           map[string]string      `yaml:"env,omitempty" json:"env,omitempty"`
	Stages        map[string]StageConfig `yaml:"stages" json:"stages"`
	Notifications map[string]NotifConfig `yaml:"notifications,omitempty" json:"notifications,omitempty"`
}

type StageConfig struct {
	Image     string   `yaml:"image,omitempty" json:"image,omitempty"`
	Commands  []string `yaml:"commands" json:"commands"`
	DependsOn []string `yaml:"depends_on,omitempty" json:"depends_on,omitempty"`
	Cache     []string `yaml:"cache,omitempty" json:"cache,omitempty"`
	When      *When    `yaml:"when,omitempty" json:"when,omitempty"`
	Type      string   `yaml:"type,omitempty" json:"type,omitempty"`    // ssh, docker, k8s
	Host      string   `yaml:"host,omitempty" json:"host,omitempty"`
	Timeout   int      `yaml:"timeout,omitempty" json:"timeout,omitempty"` // seconds
}

type When struct {
	Branch string `yaml:"branch,omitempty" json:"branch,omitempty"`
	Event  string `yaml:"event,omitempty" json:"event,omitempty"`   // push, pull_request, tag
}

type NotifConfig struct {
	On []string `yaml:"on" json:"on"` // success, failure, always
}

// ParsePipeline parses YAML pipeline configuration
func ParsePipeline(data []byte) (*PipelineConfig, error) {
	var config PipelineConfig
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, fmt.Errorf("invalid pipeline YAML: %w", err)
	}

	if err := validatePipeline(&config); err != nil {
		return nil, err
	}

	return &config, nil
}

// validatePipeline performs basic validation on the pipeline config
func validatePipeline(config *PipelineConfig) error {
	if config.Pipeline.Name == "" {
		return fmt.Errorf("pipeline name is required")
	}

	if len(config.Pipeline.Stages) == 0 {
		return fmt.Errorf("pipeline must have at least one stage")
	}

	// Validate stage dependencies exist
	for name, stage := range config.Pipeline.Stages {
		for _, dep := range stage.DependsOn {
			if _, ok := config.Pipeline.Stages[dep]; !ok {
				return fmt.Errorf("stage '%s' depends on unknown stage '%s'", name, dep)
			}
		}

		if len(stage.Commands) == 0 {
			return fmt.Errorf("stage '%s' must have at least one command", name)
		}
	}

	// Check for circular dependencies
	if err := checkCircularDeps(config.Pipeline.Stages); err != nil {
		return err
	}

	return nil
}

// checkCircularDeps detects circular dependencies using DFS
func checkCircularDeps(stages map[string]StageConfig) error {
	visited := make(map[string]bool)
	recStack := make(map[string]bool)

	var dfs func(name string) error
	dfs = func(name string) error {
		visited[name] = true
		recStack[name] = true

		stage := stages[name]
		for _, dep := range stage.DependsOn {
			if !visited[dep] {
				if err := dfs(dep); err != nil {
					return err
				}
			} else if recStack[dep] {
				return fmt.Errorf("circular dependency detected: %s -> %s", name, dep)
			}
		}

		recStack[name] = false
		return nil
	}

	for name := range stages {
		if !visited[name] {
			if err := dfs(name); err != nil {
				return err
			}
		}
	}

	return nil
}

// GetExecutionOrder returns stages in topological order
func GetExecutionOrder(stages map[string]StageConfig) ([]string, error) {
	inDegree := make(map[string]int)
	for name := range stages {
		inDegree[name] = 0
	}
	for _, stage := range stages {
		for _, dep := range stage.DependsOn {
			inDegree[dep]++ // not quite — reversed
		}
	}

	// Kahn's algorithm (topological sort)
	// Build adjacency: dependency -> dependents
	dependents := make(map[string][]string)
	for name := range stages {
		inDegree[name] = len(stages[name].DependsOn)
		for _, dep := range stages[name].DependsOn {
			dependents[dep] = append(dependents[dep], name)
		}
	}

	var queue []string
	for name, deg := range inDegree {
		if deg == 0 {
			queue = append(queue, name)
		}
	}

	var order []string
	for len(queue) > 0 {
		current := queue[0]
		queue = queue[1:]
		order = append(order, current)

		for _, dep := range dependents[current] {
			inDegree[dep]--
			if inDegree[dep] == 0 {
				queue = append(queue, dep)
			}
		}
	}

	if len(order) != len(stages) {
		return nil, fmt.Errorf("circular dependency detected in pipeline stages")
	}

	return order, nil
}
