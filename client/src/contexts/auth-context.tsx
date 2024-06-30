import { useContext, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: any;
  token: string | null;
  loginAct: (data: any) => void;
  logoutAct: () => void;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const initialState: AuthContextType = {
  user: null,
  token: null,
  loginAct: () => null,
  logoutAct: () => null,
};

const AuthContext = createContext<AuthContextType>(initialState);

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const navigate = useNavigate();

  const loginAct = async (data: any) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    navigate("/dashboard");
    return;
  };

  const logoutAct = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      {...props}
      value={{ user, token, loginAct, logoutAct }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
