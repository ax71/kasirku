import type { RouteObject } from "react-router-dom";
import Home from "../app/Home";
import Login from "../app/Auth/Login";
import Dashboard from "../app/Dasboard";

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
