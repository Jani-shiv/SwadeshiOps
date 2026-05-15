import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthProvider';
import { useAuth } from './store/useAuth';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import PipelinesPage from './pages/PipelinesPage';
import DeploymentsPage from './pages/DeploymentsPage';
import LogsPage from './pages/LogsPage';
import SecretsPage from './pages/SecretsPage';
import SettingsPage from './pages/SettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 border-3 border-slate-200 rounded-full animate-spin"
            style={{ borderTopColor: 'var(--color-accent)' }}
          />
          <p className="text-sm font-medium text-slate-400">Loading SwadeshiOps...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="pipelines" element={<PipelinesPage />} />
            <Route path="deployments" element={<DeploymentsPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route path="secrets" element={<SecretsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}



