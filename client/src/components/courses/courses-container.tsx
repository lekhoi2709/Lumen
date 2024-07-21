import Title from "@/components/courses/title";
import { useCourses } from "@/services/queries";
import Loading from "../loading";
import { useNavigate } from "react-router-dom";
import { Course } from "@/types/course";

function CoursesContainer() {
  const { data, isLoading } = useCourses();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="absolute top-0 left-0">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-8">
      <Title />
      <section className="w-full h-full flex flex-col gap-6 md:gap-8 md:grid md:grid-cols-[repeat(auto-fill,18rem)]">
        {data?.map((item: Course) => (
          <div
            onClick={() => navigate(`/courses/${item._id}`)}
            key={item._id}
            className="rounded-lg border border-border relative hover:shadow-lg transition-shadow duration-300 ease-in-out hover:cursor-pointer dark:shadow-white/20"
          >
            <img
              src={item.image}
              alt="courses-bg"
              className="rounded-t-lg w-[48rem] h-[8rem] object-cover md:w-[18rem] md:h-[10rem]"
              loading="lazy"
            />
            <div className="p-4 group">
              <h1 className="text-base font-bold group-hover:underline underline-offset-2 truncate">
                {item.title}
              </h1>
              <p className="text-sm text-muted-foreground group-hover:underline underline-offset-2 truncate">
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
