import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AdminRouteGuard } from "@/components/admin/AdminRouteGuard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WebhooksSidebar, WebhooksTopBar } from "@/components/admin/WebhooksSidebar";

export default function WebhooksLayout() {
  return (
    <AdminRouteGuard>
      <Helmet>
        <title>Webhooks | InstallPros Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <WebhooksSidebar />
          <div className="flex-1 flex flex-col">
            <WebhooksTopBar />
            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AdminRouteGuard>
  );
}
