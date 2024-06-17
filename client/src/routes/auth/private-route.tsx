import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

function PrivateRoute() {
  const auth = useAuth();

  if (!auth.token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default PrivateRoute;
