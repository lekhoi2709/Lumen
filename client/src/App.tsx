import "./App.css";
import { useState, useEffect, Suspense } from "react";
import SplashScreen from "@/components/splash-screen";
import { AuthProvider } from "./contexts/auth-context";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./routes/auth/signin";
import SignUp from "./routes/auth/signup";
import ForgotPassword from "./routes/auth/forgot-password";
import ResetPassword from "./routes/auth/reset-password";
import PrivateRoute from "./routes/auth/private-route";
import AuthRoute from "./routes/auth/auth-route";
import Home from "./routes";

function App() {
  const [showSplash, setShowSplash] = useState(
    () => !JSON.parse(sessionStorage.getItem("show-splash") || "false")
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem("show-splash", JSON.stringify(true));
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return showSplash ? (
    <SplashScreen />
  ) : (
    <Suspense fallback="loading">
      <Router>
        <AuthProvider>
          <Routes>
            {/* public route */}
            <Route element={<AuthRoute />}>
              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/forgot-password-2" element={<ResetPassword />} />
            </Route>
            {/* private route */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
            </Route>
            {/* catch all route */}
            <Route path="*" element={<h1>Page not found</h1>} />
          </Routes>
        </AuthProvider>
      </Router>
    </Suspense>
  );
}

export default App;
