import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DriverSidebar } from "@/components/layout/DriverSidebar";

export default function DriverDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DriverSidebar />
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
