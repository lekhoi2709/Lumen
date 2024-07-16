import { useQuery } from "@tanstack/react-query";
import { getCourses } from "./api";

export const useCourses = (role: "student" | "teacher") => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => getCourses(role),
  });
};
