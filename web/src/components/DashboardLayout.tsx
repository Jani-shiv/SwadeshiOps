import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useState } from 'react';
import type { CSSProperties } from 'react';

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const meta = pageMeta[location.pathname] || pageMeta['/'];
  const sidebarWidth = collapsed ? 88 : 268;

  return (
    <div className="min-h-screen relative noise-overlay">
      <div className="mesh-gradient" />
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <main
        className="dashboard-main relative z-10 min-h-screen transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:will-change-[margin-left]"
        style={{ '--sidebar-width': `${sidebarWidth}px` } as CSSProperties}
      >
        <TopBar breadcrumb={meta.breadcrumb} onOpenNav={() => setMobileOpen(true)} />

        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-4 pb-10 pt-5 sm:px-6 lg:px-10 lg:pb-14 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}



