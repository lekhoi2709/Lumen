import { User } from "@/types/user";
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
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const loginAct = async (data: any) => {
    setUser(data.user);
    sessionStorage.setItem("token", data.token);
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
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
