import Layout from "@/layouts/layout";
import CoursesContainer from "@/components/courses/courses-container";

function CoursesPage() {
  return (
    <Layout>
      <div className="w-full p-6 pr-4 md:p-6 md:pl-[224px]">
        <CoursesContainer />
      </div>
    </Layout>
  );
}

export default CoursesPage;
