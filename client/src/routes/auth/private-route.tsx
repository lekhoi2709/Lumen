import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import axios from "axios";

function PrivateRoute() {
  const { user, loginAct } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const refreshToken = localStorage.getItem("refreshToken");
    const verifyRefreshToken = async () => {
      await axios
        .get(`${process.env.API_URL}/auth/refresh`, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          loginAct(res.data);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    };

    if (!user) {
      verifyRefreshToken();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default PrivateRoute;
