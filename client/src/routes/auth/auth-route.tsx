import { Navigate, Outlet } from "react-router-dom";

function AuthRoute() {
  if (localStorage.getItem("refreshToken")) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default AuthRoute;
