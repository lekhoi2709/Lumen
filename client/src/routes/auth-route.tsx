import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

function AuthRoute() {
  const auth = useAuth();

  if (!auth.token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default AuthRoute;
