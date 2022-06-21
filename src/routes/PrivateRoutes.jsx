import { Outlet, Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/Auth";

export function PrivateRoutes() {
  const { user, token } = useAuth();
  const location = useLocation();

  return user?.id && token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
