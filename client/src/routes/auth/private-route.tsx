import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { verifyRefreshToken } from "@/services/api/auth-api";

function PrivateRoute() {
  const { user, loginAct } = useAuth();
  const [isLoading, setLoading] = useState<boolean>(true);
  const token = sessionStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      await verifyRefreshToken()
        .then((res) => {
          loginAct(res);
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
      fetchUser();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return <Outlet />;
}

export default PrivateRoute;
