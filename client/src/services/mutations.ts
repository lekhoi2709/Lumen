import { Course } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse } from "./api";

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (course: Course) => createCourse(course),
    onMutate: () => {
      console.log("mutate");
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      console.log("success");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
