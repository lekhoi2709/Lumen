import Layout from "./layout";
import CourseMenu from "@/components/courses/detail/menu";
import { Toaster } from "@/components/ui/toaster";

function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <CourseMenu />
      <div className="w-full md:pt-20 px-2 p-4 md:p-8 md:pl-[16rem] relative z-0 flex justify-center">
        {children}
      </div>
      <Toaster />
    </Layout>
  );
}

export default CourseLayout;
