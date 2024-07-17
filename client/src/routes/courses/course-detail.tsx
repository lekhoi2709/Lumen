import { useParams } from "react-router-dom";
import Layout from "@/layouts/layout";
import { useCourse } from "@/services/queries";
import Loading from "@/components/loading";
import CourseMenu from "@/components/courses/detail/menu";

function CourseDetail() {
  const { id } = useParams();
  const { isLoading } = useCourse(id!);

  if (isLoading) {
    return (
      <div className="absolute top-0 left-0">
        <Loading />
      </div>
    );
  }

  return (
    <Layout>
      <CourseMenu />
      <div className="w-full md:pt-20 p-8 md:pl-[16rem] relative z-0">{id}</div>
    </Layout>
  );
}

export default CourseDetail;
