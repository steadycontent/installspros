import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminRouteGuard } from "@/components/admin/AdminRouteGuard";

export default function AdminLayout() {
  return (
    <AdminRouteGuard>
      <Helmet>
        <title>Analytics | InstallPros Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </AdminRouteGuard>
  );
}
