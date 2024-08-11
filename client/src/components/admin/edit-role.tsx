import React, { useState } from "react";
import { editUserRole } from "@/services/api/admin-api";

interface EditRoleFormProps {
  userId: string;
  onSuccess: () => void;
  onClose: () => void;
}

const EditRoleForm: React.FC<EditRoleFormProps> = ({
  userId,
  onSuccess,
  onClose,
}) => {
  const [newRole, setNewRole] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editUserRole(userId, newRole);
      await onSuccess();
      onClose(); // Đóng form khi thành công
    } catch (error) {
      console.error("Failed to edit user role:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-md bg-white p-4">
        <h3 className="mb-4 text-lg font-bold">Edit User Role</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Role:</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Save
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

export default EditRoleForm;
