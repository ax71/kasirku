import AppSidebar from "@/components/common/app-sidebar";
import ModeToggle from "@/components/common/mode-toggle";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex justify-between shrink-0 h-16 justify-end items-center gap-2 transition-[width,height] ease-linear group-has-data[collapsible=icon]/sidebar-wrapper:h-12">
          {/* kalo nanti buat sparator dan breadcrumb bisa di sini */}
          <div className="flex items-center gap-2 px-4">
            <div className="px-4 ">
              <ModeToggle />
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col items-start gap-4 p-4 pt-0">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;
