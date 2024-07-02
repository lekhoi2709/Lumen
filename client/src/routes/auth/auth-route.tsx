import { Navigate, Outlet } from "react-router-dom";

function AuthRoute() {
  if (sessionStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default AuthRoute;
