import { useQuery } from "@tanstack/react-query";
import {
  getAssignment,
  getAssignmentsForGrading,
  getAssignmentsForStudent,
  getPosts,
} from "../api/posts-api";

export const usePosts = (courseId: string) => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(courseId),
  });
};

export const useAssignment = (postId: string) => {
  return useQuery({
    queryKey: ["assignment", postId],
    queryFn: () => getAssignment(postId),
  });
};

export const useAssignmentsForGrading = (courseId: string) => {
  return useQuery({
    queryKey: ["assignments"],
    queryFn: () => getAssignmentsForGrading(courseId),
  });
};

export const useAssignmentsForStudent = (courseId: string) => {
  return useQuery({
    queryKey: ["assignments"],
    queryFn: () => getAssignmentsForStudent(courseId),
  });
};
