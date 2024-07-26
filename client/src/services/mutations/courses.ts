import { AddCoursePeopleType, Course } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addPeopleToCourse,
  createCourse,
  joinCourse,
} from "../api/courses-api";
import { toast } from "@/components/ui/use-toast";

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (course: Course) => createCourse(course),
    onMutate: () => {
      console.log("mutate");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response.data.message,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Course created",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useJoinCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; courseId: string }) => joinCourse(data),
    onMutate: () => {
      console.log("mutate");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response.data.message,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "You have joined the class",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useAddPeopleToCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (people: AddCoursePeopleType) => addPeopleToCourse(people),
    onMutate: () => {
      console.log("mutate");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response.data.message,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Added to course successfully",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["course-people"] });
    },
  });
}