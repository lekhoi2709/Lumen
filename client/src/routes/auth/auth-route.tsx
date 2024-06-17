import { useAuth } from "@/contexts/auth-context";
import { Navigate, Outlet } from "react-router-dom";

function AuthRoute() {
  const auth = useAuth();

  if (auth.token) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default AuthRoute;
