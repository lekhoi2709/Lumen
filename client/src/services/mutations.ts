import { Course } from "@/types/course";
import { useMutation } from "@tanstack/react-query";
import { createCourse } from "./api";

export function useCreateCourse() {
  return useMutation({
    mutationFn: (course: Course) => createCourse(course),
    onMutate: () => {
      console.log("mutate");
    },
    onError: () => {
      console.log("error");
    },
    onSuccess: () => {
      console.log("success");
    },
    onSettled: () => {
      console.log("settled");
    },
  });
}
