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
  const response = await axiosInstance.delete(`/courses/c/p/${postId}/delete`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
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

export const deleteComment = async (data: {
  postId: string;
  commentId: string;
}) => {
  const response = await axiosInstance.delete(
    `/courses/c/p/${data.postId}/comment/${data.commentId}/delete`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};

export const uploadFiles = async (files: File[], token: string) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axiosInstance.post("/uploads/upload-file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteFile = async (userId: string, fileName: string, token: string) => {
  const response = await axiosInstance.delete(`/uploads/file/${userId}/${fileName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
