import { Outlet, Navigate } from "react-router-dom";

export function PublicRoutes() {
  const user = JSON.parse(localStorage.getItem("lanstad-user"));
  const token = localStorage.getItem("lanstad-token");

  return user?.id && token ? <Navigate to="/dashboard" /> : <Outlet />;
}
