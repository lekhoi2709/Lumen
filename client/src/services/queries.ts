import { useQuery } from "@tanstack/react-query";
import { getCourses, getCourse } from "./api";

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourse(id),
  });
};
