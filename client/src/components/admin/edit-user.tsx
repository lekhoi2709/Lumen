import React, { useState } from "react";
import { updateUser } from "@/services/api/admin-api";

interface EditUserFormProps {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  onSuccess: () => Promise<void>;
  onClose: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({
  user,
  onSuccess,
  onClose,
}) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(user._id, { firstName, lastName, email, role });
      await onSuccess();
      onClose(); // Đóng form khi thành công
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-md bg-white p-4">
        <h3 className="mb-4 text-lg font-bold">Edit User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;
