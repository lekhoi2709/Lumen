import CourseLayout from "@/layouts/course-layout";
import { useTranslation } from "react-i18next";
import { useCoursePeople } from "@/services/queries/courses";
import { useParams } from "react-router-dom";
import Loading from "@/components/loading";
import PeopleList from "@/components/courses/people/people-list";
import AddPeopleDialog from "@/components/courses/people/add-people";

function CoursePeople() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useCoursePeople(id!);

  if (isLoading) {
    return (
      <CourseLayout>
        <Loading />
      </CourseLayout>
    );
  }

  return (
    <CourseLayout>
      <section className="flex w-full max-w-[50rem] flex-col gap-8 md:gap-16">
        <div className="flex w-full flex-col gap-2 p-2 md:gap-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-4">
              <h1 className="pl-2 text-xl font-bold md:p-0 md:text-2xl">
                {t("courses.people.instructors")}
              </h1>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted-foreground pt-[1px] text-sm text-background">
                {data?.instructors.length}
              </span>
            </span>
            <AddPeopleDialog type="ins" />
          </div>
          <PeopleList isInstructorSection={true} people={data?.instructors} />
        </div>
        <div className="flex w-full flex-col gap-2 p-2 md:gap-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-4">
              <h1 className="pl-2 text-xl font-bold md:p-0 md:text-2xl">
                {t("courses.people.students")}
              </h1>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted-foreground pt-[1px] text-sm text-background">
                {data?.students.length}
              </span>
            </span>
            <AddPeopleDialog type="stu" />
          </div>
          <PeopleList people={data?.students} />
        </div>
      </section>
    </CourseLayout>
  );
}

export default CoursePeople;
