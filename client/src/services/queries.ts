import { useQuery } from "@tanstack/react-query";
import { getCourses, getCourse } from "./api";

export const useCourses = (role: "student" | "teacher") => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => getCourses(role),
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourse(id),
  });
};
