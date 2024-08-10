import Layout from "./layout";
import CourseMenu from "@/components/courses/detail/menu";
import { Toaster } from "@/components/ui/toaster";

function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <CourseMenu />
      <div className="relative z-0 flex w-full flex-col items-center p-4 px-2 pt-[4.6rem] md:p-8 md:pl-[16rem] md:pt-20">
        {children}
      </div>
      <Toaster />
    </Layout>
  );
}

export default CourseLayout;
