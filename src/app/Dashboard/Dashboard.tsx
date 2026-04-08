import AppSidebar from "@/components/common/app-sidebar";
import ModeToggle from "@/components/common/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import DashboardBreadcrumb from "./components/dashboard-breadcrumb";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex justify-between shrink-0 h-16 items-center gap-2 transition-[width,height] ease-linear group-has-data[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="cursor-pointer" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DashboardBreadcrumb />
          </div>
          <div className="px-4 ">
            <ModeToggle />
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
