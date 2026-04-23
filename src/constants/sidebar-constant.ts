import {
  Armchair,
  LayoutDashboard,
  ShoppingCart,
  SquareMenu,
  Users,
} from "lucide-react";

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
      url: "/admin/order",
      icon: ShoppingCart,
    },
    {
      title: "Table",
      url: "/admin/table",
      icon: Armchair,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
  ],
  cashier: [
    {
      title: "Order",
      url: "/admin/order",
      icon: ShoppingCart,
    },
  ],
  kitchen: [
    {
      title: "Order",
      url: "/admin/order",
      icon: ShoppingCart,
    },
  ],
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;
