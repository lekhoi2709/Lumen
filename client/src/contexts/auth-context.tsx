import { useContext, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: any;
  token: string;
  loginAct: (data: any) => void;
  logoutAct: () => void;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const initialState: AuthContextType = {
  user: null,
  token: "",
  loginAct: () => null,
  logoutAct: () => null,
};

const AuthContext = createContext<AuthContextType>(initialState);

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const navigate = useNavigate();

  const loginAct = async (data: any) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (result.data) {
        setUser(result.data.user);
        setToken(result.data.token);
        localStorage.setItem("token", result.data.token);
        navigate("/");
        return;
      }
      throw new Error(result.message);
    } catch (err) {
      console.log(err);
    }
  };

  const logoutAct = () => {
    setUser(null);
    setToken("");
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
