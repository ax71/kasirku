import { Store } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import {
  SIDEBAR_MENU_LIST,
  type SidebarMenuKey,
} from "@/constants/sidebar-constant";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { useProfile } from "@/hooks/use-auth";
import LoadingSidebar from "./loding-sidebar";

export default function AppSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  const { data: profile, isLoading } = useProfile();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="font-semibold">
                <div className="bg-primary flex p-2 items-center justify-center rounded-md">
                  <Store className="size-4" />
                </div>
                kasirKU
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {isLoading ? (
                <LoadingSidebar />
              ) : (
                SIDEBAR_MENU_LIST[profile.role as SidebarMenuKey]?.map(
                  (item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <a
                          href={item.url}
                          className={cn("px-4 py-3 h-auto", {
                            "bg-primary text-white hover:bg-primary/80 hover:text-white":
                              pathname === item.url,
                          })}
                        >
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ),
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
