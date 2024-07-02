import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { Navigate, useLocation } from "react-router-dom";

function GoogleSuccess() {
  const { user, loginAct } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const getUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.API_URL}/auth/google/success/`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          loginAct(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
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
