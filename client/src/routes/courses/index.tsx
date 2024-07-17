import Layout from "@/layouts/layout";
import CoursesContainer from "@/components/courses/courses-container";

function CoursesPage() {
  return (
    <Layout>
      <div className="w-full p-8 md:pl-[16rem] relative z-0">
        <CoursesContainer />
      </div>
    </Layout>
  );
}

export default CoursesPage;
