import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-slate-50 w-screen overflow-hidden fixed inset-0">
      <Sidebar />
      <div className="flex flex-col flex-1 ml-64 overflow-hidden h-full w-full">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 w-full bg-slate-50 max-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

