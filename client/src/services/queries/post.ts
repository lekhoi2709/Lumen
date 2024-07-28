import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../api/posts-api";

export const usePosts = (courseId: string) => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(courseId),
  });
};
