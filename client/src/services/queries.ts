import { useQuery } from "@tanstack/react-query";
import {
  getCourses,
  getCourse,
  getCoursePeople,
  getSearchedPeople,
} from "./api";

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

export const useCoursePeople = (id: string) => {
  return useQuery({
    queryKey: ["course-people", id],
    queryFn: () => getCoursePeople(id),
  });
};

export const useSearchedPeople = (id: string, data: string) => {
  return useQuery({
    queryKey: ["searched-people", id, data],
    queryFn: () => getSearchedPeople(id, data),
    retry: false,
  });
};
