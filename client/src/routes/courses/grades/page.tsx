import CourseLayout from "@/layouts/course-layout";
import DataTable from "./data-table";
import { useAssignmentsForGrading } from "@/services/queries/post";
import { useParams } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/auth-context";

function GradesPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const isTeacher =
    user?.courses?.find((course) => course.code === id)?.role === "Teacher";

  if (!isTeacher) {
    return (
      <CourseLayout>
        <h1 className="mt-8 text-center font-nunito text-3xl">
          You don't have permission to view this page
        </h1>
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
        {isTeacher && <DataTable t={t} gradeTable={data!} />}
      </main>
    </CourseLayout>
  );
}

export default GradesPage;
