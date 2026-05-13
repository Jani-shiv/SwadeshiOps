import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-navy)' }}>
      <Sidebar />
      <main className="ml-[260px] p-8 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
