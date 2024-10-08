import { Profile, User } from "@/types/user";
import { useContext, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: User | null;
  loginAct: (data: any) => void;
  logoutAct: () => void;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const initialState: AuthContextType = {
  user: null,
  loginAct: () => null,
  logoutAct: () => null,
};

const AuthContext = createContext<AuthContextType>(initialState);

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  const loginAct = async (data: Profile) => {
    if (data.user) {
      setUser(data.user);
    }

    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    sessionStorage.setItem("token", data.token);
    if (data.user?.role === "Admin") {
      navigate("/admin");
      return;
    }
    navigate(sessionStorage.getItem("history") || "/dashboard");
    return;
  };

  const logoutAct = () => {
    setUser(null);
    sessionStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("history");
    navigate("/login");
  };

  return (
    <AuthContext.Provider {...props} value={{ user, loginAct, logoutAct }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
