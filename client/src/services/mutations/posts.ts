import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  deletePost,
  updatePost,
  commentPost,
  deleteComment,
  submitAssignment,
  unsubmitAssignment,
  gradingSubmission,
} from "../api/posts-api";
import { SubmitAssignmentType, TUnionPost } from "@/types/post";
import { SearchedUserData } from "@/types/user";
import { toast } from "@/components/ui/use-toast";

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { courseId: string; postData: TUnionPost }) =>
      createPost(data),
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
        description: "Announce created",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
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
        description: "Announce deleted",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { postId: string; postData: TUnionPost }) =>
      updatePost(data),
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
        description: "Announce updated",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useCommentPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      postId: string;
      user: SearchedUserData;
      text: string;
    }) => commentPost(data),
    onMutate: () => {
      console.log("mutate");
    },
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Comment added",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useCommentAssigment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      postId: string;
      user: SearchedUserData;
      text: string;
    }) => commentPost(data),
    onMutate: () => {
      console.log("mutate");
    },
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Comment added",
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assignment", variables.postId],
      });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { postId: string; commentId: string }) =>
      deleteComment(data),
    onMutate: () => {
      console.log("mutate");
    },
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Comment removed",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { postId: string; postData: SubmitAssignmentType }) =>
      submitAssignment(data),
    onMutate: () => {
      console.log("mutate");
    },
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Assignment submitted",
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assignment", variables.postId],
      });
    },
  });
}

export function useUnsubmitAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { postId: string; submissionId: string }) =>
      unsubmitAssignment(data),
    onMutate: () => {
      console.log("mutate");
    },
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Assignment unsubmitted",
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assignment", variables.postId],
      });
    },
  });
}

export function useGradingSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      courseId: string;
      postId: string;
      gradedBy: SearchedUserData;
      grade: number;
      maxGrade: number;
      comment?: string;
      studentEmail: string;
    }) => gradingSubmission(data),
    onMutate: () => {
      console.log("mutate");
    },
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Assignment submitted",
      });
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assignment", variables.postId],
      });
    },
  });
}
