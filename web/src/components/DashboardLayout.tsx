import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--color-navy)' }}>
      {/* Ambient gradient mesh */}
      <div className="mesh-gradient" />

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main Content */}
      <main
        className="relative z-10 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          marginLeft: collapsed ? 72 : 260,
          padding: '32px 40px',
          minHeight: '100vh',
        }}
      >
        {/* Top fade gradient */}
        <div
          className="fixed top-0 right-0 h-24 z-20 pointer-events-none"
          style={{
            left: collapsed ? 72 : 260,
            background: 'linear-gradient(to bottom, var(--color-navy), transparent)',
            transition: 'left 0.5s cubic-bezier(0.4,0,0.2,1)',
          }}
        />

        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
