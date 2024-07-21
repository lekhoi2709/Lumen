import { useParams } from "react-router-dom";
import { useCourse } from "@/services/queries";
import CourseLayout from "@/layouts/course-layout";
import Loading from "@/components/loading";
import CourseOverview from "@/components/courses/detail/overview";

function CourseDetail() {
  const { id } = useParams();
  const { data, isLoading } = useCourse(id!);

  if (isLoading) {
    return (
      <div className="absolute top-0 left-0">
        <Loading />
      </div>
    );
  }

  if (data) {
    return (
      <CourseLayout>
        <CourseOverview data={data} />
      </CourseLayout>
    );
  }
}

export default CourseDetail;
