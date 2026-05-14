import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useState } from 'react';

const pageMeta: Record<string, { title: string; breadcrumb: string }> = {
  '/': { title: 'Dashboard', breadcrumb: 'Overview' },
  '/projects': { title: 'Projects', breadcrumb: 'Projects' },
  '/pipelines': { title: 'Pipelines', breadcrumb: 'Pipelines' },
  '/deployments': { title: 'Deployments', breadcrumb: 'Deployments' },
  '/logs': { title: 'Logs', breadcrumb: 'Live Logs' },
  '/secrets': { title: 'Secrets', breadcrumb: 'Secrets & Variables' },
  '/settings': { title: 'Settings', breadcrumb: 'Settings' },
};

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const meta = pageMeta[location.pathname] || pageMeta['/'];

  return (
    <div className="min-h-screen relative noise-overlay" style={{ background: 'var(--color-navy)' }}>
      {/* Ambient gradient mesh */}
      <div className="mesh-gradient" />

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main Content */}
      <main
        className="relative z-10 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          marginLeft: collapsed ? 72 : 260,
          minHeight: '100vh',
        }}
      >
        {/* Top Bar */}
        <TopBar breadcrumb={meta.breadcrumb} collapsed={collapsed} />

        {/* Page Content */}
        <div className="relative z-10 px-8 pb-10 pt-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
