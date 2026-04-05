import type { RouteObject } from "react-router-dom";
import Login from "../app/Auth/Login";
import Home from "../app/Home";
import Dashboard from "@/app/Dashboard";

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
    path: "/dashboard",
    element: <Dashboard />,
  },
];
