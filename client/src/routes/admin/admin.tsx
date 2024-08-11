import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import Navbar from "@/components/admin/navbar";
import UserList from "./user-list";
import CourseList from "./course-list";
import DeleteConfirmDialog from "@/components/admin/confirm-dialog";
import { LogOut } from "lucide-react";
import { getDashboardStats } from "@/services/api/admin-api";

const AdminDashboard: React.FC = () => {
  const [view, setView] = useState<"users" | "courses">("users");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null); // State to store statistics data
  const { logoutAct } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statsData = await getDashboardStats();
        setStats(statsData.data);
        setError(null);
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logoutAct();
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleDialogConfirm = () => {
    console.log("Confirmed!");
    setIsDialogOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center rounded bg-red-500 px-4 py-2 text-white"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      <Navbar setView={setView} />

      {/* Display statistics */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Statistics</h2>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="rounded bg-gray-100 p-4 shadow">
            <h3 className="text-md font-medium">Total Users</h3>
            <p className="text-xl font-bold">{stats?.totalUsers ?? "N/A"}</p>
          </div>
          <div className="rounded bg-gray-100 p-4 shadow">
            <h3 className="text-md font-medium">Total Courses</h3>
            <p className="text-xl font-bold">{stats?.totalCourses ?? "N/A"}</p>
          </div>
        </div>
      </div>

      {view === "users" && <UserList />}
      {view === "courses" && <CourseList />}

      <DeleteConfirmDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDialogConfirm}
      />
    </div>
  );
};

export default AdminDashboard;
