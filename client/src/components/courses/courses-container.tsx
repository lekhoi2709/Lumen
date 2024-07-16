import Title from "@/components/courses/title";
import { useCourses } from "@/services/queries";
import Loading from "../loading";
import { useAuth } from "@/contexts/auth-context";

function CoursesContainer() {
  const { user } = useAuth();
  const { data, isLoading } = useCourses(
    user?.role === "Teacher" ? "teacher" : "student"
  );

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
        {data?.map((item) => (
          <div
            key={item.classCode}
            className="rounded-lg border border-border relative"
          >
            <img
              src={item.image}
              alt="courses-bg"
              className="rounded-t-lg max-w-full h-auto object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h1 className="text-base font-bold">{item.title}</h1>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
              {user?.role === "Student" && (
                <p className="text-sm text-muted-foreground">
                  {item.instructor.name}
                </p>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default CoursesContainer;
