import { useParams } from "react-router-dom";
import Layout from "@/layouts/layout";
import { useCourse } from "@/services/queries";
import Loading from "@/components/loading";

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

  console.log(data);

  return (
    <Layout>
      <div className="w-full p-8 md:pl-[16rem] relative z-0">{id}</div>
    </Layout>
  );
}

export default CourseDetail;
