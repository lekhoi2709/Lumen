import CourseLayout from "@/layouts/course-layout";
import { useTranslation } from "react-i18next";
import { useCoursePeople } from "@/services/queries";
import { useParams } from "react-router-dom";
import Loading from "@/components/loading";
import PeopleList from "@/components/courses/detail/people-list";
import AddPeopleDialog from "@/components/courses/detail/add-people";

function CoursePeople() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useCoursePeople(id!);

  if (isLoading) {
    return (
      <div className="absolute top-0 left-0">
        <Loading />
      </div>
    );
  }

  return (
    <CourseLayout>
      <section className="w-full max-w-[50rem] flex flex-col gap-8 md:gap-16">
        <div className="flex flex-col w-full p-2 gap-2 md:gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold pl-2 md:p-0">
              {t("courses.people.instructors")}
            </h1>
            <AddPeopleDialog type="ins" />
          </div>
          <PeopleList people={data?.instructors} />
        </div>
        <div className="flex flex-col w-full p-2 gap-2 md:gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold pl-2 md:p-0">
              {t("courses.people.students")}
            </h1>
            <AddPeopleDialog type="stu" />
          </div>
          <PeopleList people={data?.students} />
        </div>
      </section>
    </CourseLayout>
  );
}

export default CoursePeople;
