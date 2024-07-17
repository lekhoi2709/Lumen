import { useParams } from "react-router-dom";
import Layout from "@/layouts/layout";
import { useCourse } from "@/services/queries";
import Loading from "@/components/loading";
import CourseMenu from "@/components/courses/detail/menu";
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
      <Layout>
        <CourseMenu />
        <div className="w-full md:pt-20 px-2 p-4 md:p-8 md:pl-[16rem] relative z-0 flex justify-center">
          <CourseOverview data={data} />
        </div>
      </Layout>
    );
  }
}

export default CourseDetail;
