import React, { useEffect, useState } from "react";
import { getCoursesList, deleteCourse } from "@/services/api/admin-api";
import EditCourseForm from "@/components/admin/edit-course";
import { Edit, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import DeleteConfirmDialog from "@/components/admin/confirm-dialog";

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "course";
    id: string;
  } | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getCoursesList();
        setCourses(coursesData.data.courses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleEditCourseSuccess = async () => {
    try {
      const coursesData = await getCoursesList();
      setCourses(coursesData.data.courses);
      setEditingCourseId(null);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    setItemToDelete({ type: "course", id: courseId });
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteCourse(itemToDelete.id);
        const coursesData = await getCoursesList();
        setCourses(coursesData.data.courses);
      } catch (error) {
        console.error("Failed to delete course:", error);
      }
      setItemToDelete(null);
    }
    setIsDeleteConfirmOpen(false);
  };

  return (
    <div>
      <h2 className="mb-4 text-3xl font-bold">Courses List</h2>
      <div className="overflow-x-auto">
        <Table>
          <thead>
            <tr>
              <th className="text-left text-lg py-4" style={{ width: '40%' }}>Title</th>
              <th className="text-left text-lg py-4" style={{ width: '40%' }}>Description</th>
              <th className="text-left text-lg py-4" style={{ width: '20%' }}>Actions</th>
            </tr>
          </thead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id} className="py-4">
                <TableCell className="p-0 text-lg" style={{ width: '40%' }}>
                  {course.title}
                </TableCell>
                <TableCell className="p-0 text-lg" style={{ width: '40%' }}>
                  {course.description}
                </TableCell>
                <TableCell className="p-0 text-lg" style={{ width: '20%' }}>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingCourseId(course._id)}
                      className="rounded bg-blue-500 px-3 py-2 text-white"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="rounded bg-red-500 px-3 py-2 text-white"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                  {editingCourseId === course._id && (
                    <EditCourseForm
                      course={course}
                      onSuccess={handleEditCourseSuccess}
                      onClose={() => setEditingCourseId(null)}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmDialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CourseList;
