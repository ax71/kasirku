import type { RouteObject } from "react-router-dom";
import Login from "@/features/auth/components/LoginPage";
import Home from "../app/Home";
import Dashboard from "@/app/Dashboard";
import AdminPage from "@/app/Dashboard/Admin";
import MenuPage from "@/features/menu/MenuPage";
import UsersPage from "@/features/user/UserPage";
import ProtectedRoute from "./protected-route";
import TablePage from "@/features/table/TablePage";
import OrderManagement from "@/features/order/Order";
import DetailOrder from "@/features/order/detailOrder/DetailOrder";
import AddOrderItemPage from "@/features/order/detailOrder/AddOrderItemPage";

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
      <ProtectedRoute allowedRoles={["admin", "cashier", "kitchen"]}>
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
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <MenuPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "table",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <TablePage />
          </ProtectedRoute>
        ),
      },
      // ─── Order routes ────────────────────────────────────────────────────────
      {
        path: "order",
        element: <OrderManagement />,
      },
      {
        path: "order/:id",
        element: <DetailOrder />,
      },
      {
        path: "order/:id/add",
        element: <AddOrderItemPage />,
      },
    ],
  },
];
