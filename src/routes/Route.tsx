import type { RouteObject } from "react-router-dom";
import Login from "../app/Auth/Login";
import Home from "../app/Home";
import Dashboard from "@/app/Dashboard";
import AdminPage from "@/app/Dashboard/Admin";
import MenuPage from "@/app/Dashboard/Menu";
import UsersPage from "@/app/Dashboard/User";
import OrderPage from "@/app/Order";
import ProtectedRoute from "./protected-route";

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
    ],
  },
  {
    path: "/order",
    element: (
      <ProtectedRoute allowedRoles={["admin", "kasir"]}>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <OrderPage />,
      },
    ],
  },
];
