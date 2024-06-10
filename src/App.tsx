import "./App.css";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import AuthLayout from "@/components/auth-layout";
import SplashScreen from "./components/splash-screen";

function App() {
  const [showSplash, setShowSplash] = useState(
    () => !JSON.parse(localStorage.getItem("isFirstTimeShowSplash") || "false")
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("isFirstTimeShowSplash", JSON.stringify(true));
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return showSplash ? (
    <SplashScreen />
  ) : (
    <AuthLayout>
      <Button>Sign In</Button>
    </AuthLayout>
  );
}

export default App;
