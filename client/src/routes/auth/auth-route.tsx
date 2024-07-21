import { Navigate, Outlet, useLocation } from "react-router-dom";

function AuthRoute() {
  const token = sessionStorage.getItem("token");
  const location = useLocation();

  if (token) {
    return <Navigate to="/dashboard" state={{ from: location }} />;
  }

  return <Outlet />;
}

export default AuthRoute;
