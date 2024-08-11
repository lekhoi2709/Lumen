import React from "react";
import { Users, BookOpen } from "lucide-react";

interface NavbarProps {
  setView: (view: "users" | "courses") => void;
}

const Navbar: React.FC<NavbarProps> = ({ setView }) => {
  return (
    <nav className="mb-4">
      <button onClick={() => setView("users")} className="mr-4">
        <Users className="h-6 w-6" /> Users
      </button>
      <button onClick={() => setView("courses")}>
        <BookOpen className="h-6 w-6" /> Courses
      </button>
    </nav>
  );
};

export default Navbar;
