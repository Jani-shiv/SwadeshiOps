package app

import "testing"

func TestSlugify(t *testing.T) {
	t.Parallel()

	tests := map[string]string{
		"Payments Gateway":      "payments-gateway",
		"  Mobile_API!!  ":      "mobile-api",
		"Developer Portal 2026": "developer-portal-2026",
		"---":                   "resource",
	}

	for input, want := range tests {
		if got := slugify(input); got != want {
			t.Fatalf("slugify(%q) = %q, want %q", input, got, want)
		}
	}
}
