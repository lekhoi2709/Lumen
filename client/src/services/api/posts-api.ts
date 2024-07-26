import { axiosInstance } from "@/services/api/axios-instance";
import { SearchedUserData } from "@/types/user";
import { TPost } from "@/types/post";

export const getPosts = async (id: string) => {
  const response = await axiosInstance.get<TPost[]>(`/courses/c/${id}/post`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const createPost = async (data: {
  courseId: string;
  postData: TPost;
}) => {
  const response = await axiosInstance.post(
    `/courses/c/${data.courseId}/post`,
    data,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};

export const deletePost = async (postId: string) => {
  const response = await axiosInstance.post(
    `/courses/c/p/${postId}/delete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};

export const updatePost = async (data: { postId: string; postData: TPost }) => {
  const response = await axiosInstance.put(
    `/courses/c/p/${data.postId}/update`,
    data,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};

export const commentPost = async (data: {
  postId: string;
  user: SearchedUserData;
  text: string;
}) => {
  const response = await axiosInstance.put(
    `/courses/c/p/${data.postId}/comment`,
    data,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};
