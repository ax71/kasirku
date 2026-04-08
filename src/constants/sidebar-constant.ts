import { LayoutDashboard, ShoppingCart, SquareMenu, Users } from "lucide-react";

export const SIDEBAR_MENU_LIST = {
  admin: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Menu",
      url: "/admin/menu",
      icon: SquareMenu,
    },
    {
      title: "Order",
      url: "/order",
      icon: ShoppingCart,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
  ],
  kasir: [
    {
      title: "Order",
      url: "/order",
      icon: ShoppingCart,
    },
  ],
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;
