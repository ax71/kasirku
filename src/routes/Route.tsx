import type { RouteObject } from "react-router-dom";
import Login from "@/features/auth/components/LoginPage";
import Home from "../app/Home";
import Dashboard from "@/app/Dashboard";
import AdminPage from "@/features/admin";
import MenuPage from "@/features/menu/MenuPage";
import UsersPage from "@/features/user/UserPage";
import ProtectedRoute from "./protected-route";
import TablePage from "@/features/table/TablePage";
import OrderManagement from "@/features/order/Order";
import DetailOrder from "@/features/order/detailOrder/DetailOrder";
import AddOrderItemPage from "@/features/order/detailOrder/AddOrderItemPage";
import PaymentStatusPage from "@/features/order/payment-status/Payment-status";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
      {
        path: "menu",
        element: <MenuPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "table",
        element: <TablePage />,
      },
    ],
  },
  {
    path: "/order",
    element: (
      <ProtectedRoute allowedRoles={["admin", "cashier", "kitchen"]}>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <OrderManagement />,
      },
      {
        path: ":id",
        element: <DetailOrder />,
      },
      {
        path: ":id/add",
        element: <AddOrderItemPage />,
      },
      {
        path: "payment-status",
        element: <PaymentStatusPage />,
      },
    ],
  },
];
