import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  deletePost,
  updatePost,
  commentPost,
} from "../api/posts-api";
import { TPost } from "@/types/post";
import { SearchedUserData } from "@/types/user";
import { toast } from "@/components/ui/use-toast";

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { courseId: string; postData: TPost }) =>
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
    mutationFn: (data: { postId: string; postData: TPost }) => updatePost(data),
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
