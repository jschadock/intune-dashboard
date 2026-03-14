import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppShell() {
  return (
    <div className="grid grid-cols-[240px_1fr] h-screen bg-surface-950">
      <Sidebar />
      <main className="overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
}
