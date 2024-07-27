import Layout from "@/layouts/layout";
import CoursesContainer from "@/components/courses/courses-container";
import { Toaster } from "@/components/ui/toaster";

function CoursesPage() {
  return (
    <Layout>
      <div className="w-full p-4 pt-6 md:pt-4 md:pl-[16rem] relative z-0">
        <CoursesContainer />
      </div>
      <Toaster />
    </Layout>
  );
}

export default CoursesPage;
