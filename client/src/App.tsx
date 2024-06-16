import "./App.css";
import { useState, useEffect } from "react";
import SplashScreen from "@/components/splash-screen";
import { AuthProvider } from "./contexts/auth-context";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./routes/auth/signin";
import SignUp from "./routes/auth/signup";
import AuthRoute from "./routes/auth-route";
import Home from "./routes";

function App() {
  const [showSplash, setShowSplash] = useState(
    () =>
      !JSON.parse(sessionStorage.getItem("isFirstTimeShowSplash") || "false")
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem("isFirstTimeShowSplash", JSON.stringify(true));
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return showSplash ? (
    <SplashScreen />
  ) : (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route element={<AuthRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
