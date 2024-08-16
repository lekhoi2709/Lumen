import Layout from "@/layouts/layout";
import CoursesContainer from "@/components/courses/courses-container";

function CoursesPage() {
  return (
    <Layout>
      <div className="relative z-0 w-full p-4 pt-6 md:pl-[16rem] md:pt-4">
        <CoursesContainer />
      </div>
    </Layout>
  );
}

export default CoursesPage;
