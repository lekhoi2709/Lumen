import CourseLayout from "@/layouts/course-layout";
import CreateAssignmentBtn from "@/components/courses/assignments/create-assignment";
import { useAuth } from "@/contexts/auth-context";
import { useParams } from "react-router-dom";
import AssignmentView from "@/components/courses/assignments/assignments-view";
import { useState } from "react";
import ChangeViewButton from "@/components/courses/assignments/change-view-btn";
import { useCourse } from "@/services/queries/courses";

function AssignmentPage() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const { data: course } = useCourse(id!);
  const isTeacher =
    user?.courses?.find((course) => course.code === id)?.role === "Teacher";
  const isAssistant =
    user?.courses?.find((course) => course.code === id)?.role === "Assistant";
  const [view, setView] = useState<"grid" | "list">("list");

  return (
    <CourseLayout>
      <section className="flex w-full items-center justify-between">
        <ChangeViewButton view={view} setView={setView} />
        {(isTeacher || isAssistant) && <CreateAssignmentBtn />}
      </section>
      <AssignmentView courseOwner={course?.createdUserEmail} view={view} />
    </CourseLayout>
  );
}

export default AssignmentPage;
