import Title from "@/components/courses/title";
import { useCourses } from "@/services/queries/courses";
import Loading from "../loading";
import { useNavigate } from "react-router-dom";
import { Course } from "@/types/course";

function CoursesContainer() {
  const { data, isLoading } = useCourses();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="absolute left-0 top-0">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-8">
      <Title />
      <section className="flex h-full w-full flex-col gap-6 md:grid md:grid-cols-[repeat(auto-fill,18rem)] md:gap-8">
        {data?.map((item: Course) => (
          <div
            onClick={() => navigate(`/courses/${item._id}`)}
            key={item._id}
            className="relative rounded-lg border border-border transition-shadow duration-300 ease-in-out hover:cursor-pointer hover:shadow-lg dark:shadow-white/20"
          >
            <img
              src={item.image}
              alt="courses-bg"
              className="h-[8rem] w-[48rem] rounded-t-lg object-cover md:h-[10rem] md:w-[18rem]"
              loading="lazy"
            />
            <div className="group p-4">
              <h1 className="truncate text-base font-bold underline-offset-2 group-hover:underline">
                {item.title}
              </h1>
              <p className="truncate text-sm text-muted-foreground underline-offset-2 group-hover:underline">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default CoursesContainer;
