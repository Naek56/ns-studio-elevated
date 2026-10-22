import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-kairos-bg">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-kairos-surface">
        <Outlet />
      </main>
    </div>
  );
}
