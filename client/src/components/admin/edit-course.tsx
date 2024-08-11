import React, { useState } from "react";
import { updateCourse } from "@/services/api/admin-api"; // Import API

interface EditCourseFormProps {
  course: {
    _id: string;
    title: string;
    description: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

const EditCourseForm: React.FC<EditCourseFormProps> = ({
  course,
  onSuccess,
  onClose,
}) => {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCourse(course._id, { title, description });
      onSuccess();
      onClose(); // Đóng form khi thành công
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-md bg-white p-4">
        <h3 className="mb-4 text-lg font-bold">Edit Course</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
              rows={4}
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseForm;
