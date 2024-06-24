import "./App.css";
import { useState, useEffect, Suspense } from "react";
import SplashScreen from "@/components/splash-screen";
import { AuthProvider } from "./contexts/auth-context";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./routes/auth/signin";
import SignUp from "./routes/auth/signup";
import PrivateRoute from "./routes/auth/private-route";
import AuthRoute from "./routes/auth/auth-route";
import Home from "./routes";
import Navbar from "./components/nav-bar";

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
    <Suspense fallback="loading">
      <Router>
        <Navbar />
        <AuthProvider>
          <Routes>
            {/* public route */}
            <Route path="/" element={<Home />} />
            <Route element={<AuthRoute />}>
              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<SignUp />} />
            </Route>
            {/* private route */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Home />} />
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
