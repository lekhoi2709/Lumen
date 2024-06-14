import "./App.css";
import { useState, useEffect } from "react";
import AuthLayout from "@/components/layouts/auth-layout";
import SplashScreen from "@/components/splash-screen";
import SignIn from "@/routes/auth/signin";

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
    <AuthLayout>
      <SignIn />
    </AuthLayout>
  );
}

export default App;
