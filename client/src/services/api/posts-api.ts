import { axiosInstance } from "@/services/api/axios-instance";
import { SearchedUserData } from "@/types/user";
import { SubmitAssignmentType, TAssignment, TUnionPost } from "@/types/post";
import { TGradeTable } from "@/types/post";

export const getPosts = async (id: string) => {
  const response = await axiosInstance.get<TUnionPost[]>(
    `/courses/c/${id}/post`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};

export const getAssignments = async (id: string) => {
  const response = await axiosInstance.get<TUnionPost[]>(
    `/courses/c/${id}/assignment`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};

export const getAssignmentsForGrading = async (courseId: string) => {
  const response = await axiosInstance.get<TGradeTable>(
    `/courses/c/${courseId}/assignments`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};

export const getAssignmentsForStudent = async (courseId: string) => {
  const response = await axiosInstance.get<TAssignment[]>(
    `/courses/c/${courseId}/p/student/grade`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};

export const gradingSubmission = async (data: {
  courseId: string;
  postId: string;
  gradedBy: SearchedUserData;
  grade: number;
  maxGrade: number;
  comment?: string;
  studentEmail: string;
}) => {
  const response = await axiosInstance.put(
    `/courses/c/${data.courseId}/p/${data.postId}/grading`,
    data,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};

export const getAssignment = async (postId: string) => {
  const response = await axiosInstance.get<TUnionPost>(
    `/courses/c/p/${postId}`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};

export const submitAssignment = async (data: {
  postId: string;
  postData: SubmitAssignmentType;
}) => {
  const response = await axiosInstance.put(
    `/courses/c/p/${data.postId}/submission`,
    data.postData,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};

export const unsubmitAssignment = async (data: {
  postId: string;
  submissionId: string;
}) => {
  const response = await axiosInstance.put(
    `/courses/c/p/${data.postId}/submission/${data.submissionId}/delete`,
    null,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};

export const createPost = async (data: {
  courseId: string;
  postData: TUnionPost;
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

export const updatePost = async (data: {
  postId: string;
  postData: TUnionPost;
}) => {
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

export const uploadFiles = async (data: {
  courseId: string;
  files: File[];
}) => {
  const formData = new FormData();
  data.files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axiosInstance.post(
    `/uploads/upload-file/${data.courseId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );

  return response.data;
};

export const deleteFiles = async (fileNames: string[], courseId: string) => {
  const response = await axiosInstance.post(
    `/uploads/${courseId}/files/delete`,
    fileNames,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};
