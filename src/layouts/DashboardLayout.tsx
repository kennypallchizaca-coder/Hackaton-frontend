import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';

export function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F8FC] font-inter">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:ml-64 relative overflow-hidden">
        <Topbar />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-16">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
