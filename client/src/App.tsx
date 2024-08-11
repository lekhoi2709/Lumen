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
import Dashboard from "./routes/dashboard";
import GoogleSuccess from "./routes/auth/google-success";
import Loading from "./components/loading";
import PageNotFound from "./routes/404";
import CoursesPage from "./routes/courses";
import CourseDetail from "./routes/courses/course-detail";
import CoursePeople from "./routes/courses/people";
import SchedulePage from "./routes/schedule";
import GradeBookPage from "./routes/gradebook";
import AssignmentPage from "./routes/courses/assignments";
import AssignmentDetailPage from "./routes/courses/assignment-detail";

function App() {
  const [showSplash, setShowSplash] = useState(
    () => !JSON.parse(sessionStorage.getItem("show-splash") || "false"),
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
    <Suspense fallback={<Loading />}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* public route */}
            <Route path="/" element={<Home />} />
            <Route path="/verify-user" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<AuthRoute />}>
              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/oauth/success" element={<GoogleSuccess />} />
            </Route>
            {/* private route */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              {/* course routes */}
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route
                path="/courses/:id/assignments"
                element={<AssignmentPage />}
              />
              <Route
                path="/courses/:id/assignments/:postId"
                element={<AssignmentDetailPage />}
              />
              <Route path="/courses/:id/people" element={<CoursePeople />} />
              <Route path="/courses/:id/grades" element={<CourseDetail />} />
              {/* other routes */}
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/gradebook" element={<GradeBookPage />} />
            </Route>
            {/* catch all route */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </Suspense>
  );
}

export default App;
