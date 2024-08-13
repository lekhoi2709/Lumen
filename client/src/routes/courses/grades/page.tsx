import CourseLayout from "@/layouts/course-layout";
import DataTable from "./data-table";
import { StudentGradeTable } from "./student-grade-table";
import {
  useAssignmentsForGrading,
  useAssignmentsForStudent,
} from "@/services/queries/post";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/auth-context";
import generateColumns from "./columns";

function GradesPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const isTeacher =
    user?.courses?.find((course) => course.code === id)?.role === "Teacher";
  const navigate = useNavigate();

  if (!isTeacher) {
    const { data, isLoading } = useAssignmentsForStudent(id!);

    if (isLoading) {
      return (
        <CourseLayout>
          <Loader2Icon className="animate-spin" />
        </CourseLayout>
      );
    }

    return (
      <CourseLayout>
        <main className="flex w-full justify-center">
          <StudentGradeTable
            columns={generateColumns(t, user?.email!, navigate, id!)}
            data={data!}
          />
        </main>
      </CourseLayout>
    );
  }

  const { data, isLoading } = useAssignmentsForGrading(id!);

  if (isLoading) {
    return (
      <CourseLayout>
        <Loader2Icon className="animate-spin" />
      </CourseLayout>
    );
  }

  return (
    <CourseLayout>
      <main className="flex w-full justify-center">
        <DataTable t={t} gradeTable={data!} />
      </main>
    </CourseLayout>
  );
}

export default GradesPage;
