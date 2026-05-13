import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A1628' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-white/10 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading SwadeshiOps...</p>
        </div>
      </div>
    );
  }

  // For demo purposes, allow access without login
  // In production, uncomment: if (!isAuthenticated) return <Navigate to="/login" />;

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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
