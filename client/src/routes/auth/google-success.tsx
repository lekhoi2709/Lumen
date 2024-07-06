import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

function GoogleSuccess() {
  const { user, loginAct } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const getUserData = async () => {
      await axios
        .get(`${process.env.API_URL}/auth/google/success/`, {
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
      getUserData();
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

  return <Navigate to="/dashboard" state={{ from: location }} replace />;
}

export default GoogleSuccess;
