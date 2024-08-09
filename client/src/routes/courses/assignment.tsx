import CourseLayout from "@/layouts/course-layout";
import CreateAssignmentBtn from "@/components/courses/assignments/create-assignment";
import { useAuth } from "@/contexts/auth-context";
import { useParams } from "react-router-dom";

function AssignmentPage() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const isTeacher =
    user?.courses?.find((course) => course.code === id)?.role === "Teacher";
  const isAssistant =
    user?.courses?.find((course) => course.code === id)?.role === "Assistant";

  return (
    <CourseLayout>
      {(isTeacher || isAssistant) && (
        <section className="flex w-full items-center justify-end">
          <CreateAssignmentBtn />
        </section>
      )}
      <section className="w-full border md:mt-6 md:max-w-[65rem]">
        <h1>Assignments</h1>
      </section>
    </CourseLayout>
  );
}

export default AssignmentPage;
