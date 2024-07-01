import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";

function PrivateRoute() {
  const { user, loginAct } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/auth/refresh`, {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          loginAct(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      verifyRefreshToken();
    } else {
      setLoading(false);
    }

    return () => setLoading(true);
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
