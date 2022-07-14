import { Outlet, Navigate } from "react-router-dom";

export function PublicRoutes() {
  const user = JSON.parse(localStorage.getItem("lanstad-user"));
  const token = localStorage.getItem("lanstad-token");

  // remove it after demo
  return user?.id === 15331 ? (
    <Navigate to="/dashboard/books" />
  ) : user?.permissions?.rol === "Journal Editor" && token ? (
    <Navigate to="/dashboard/journals" />
  ) : user?.id && token ? (
    <Navigate to="/dashboard" />
  ) : (
    <Outlet />
  );
}
