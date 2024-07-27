import axios from "axios";
import { Profile, User, SearchedUserType } from "@/types/user";
import { AddCoursePeopleType, Course, CoursePeople } from "@/types/course";

const BASE_URL = process.env.API_URL;
const axiosInstance = axios.create({ baseURL: BASE_URL });

// Auth API
export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const register = async (user: User) => {
  const response = await axiosInstance.post("/auth/register", user);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const verifyOTP = async (email: string, otp: string) => {
  const response = await axiosInstance.post("/auth/verify-otp", { email, otp });
  return response.data;
};

export const sendOTP = async (email: string) => {
  const response = await axiosInstance.post("/auth/send-otp", { email });
  return response.data;
};

export const resetPassword = async (email: string, newPassword: string) => {
  const response = await axiosInstance.put(
    "/auth/reset-password",
    { email, newPassword },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

export const googleAuth = async () => {
  const response = await axiosInstance.post("/auth/google");
  return response.data;
};

export const getGoogleUser = async () => {
  const response = await axiosInstance.get("/auth/google/success", {
    withCredentials: true,
  });
  return response.data;
};

export const verifyRefreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const response = await axiosInstance.get<Profile>("/auth/refresh", {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
    withCredentials: true,
  });
  return response.data;
};

// Courses API
export const getCourses = async () => {
  const response = await axiosInstance.get<Course[]>(`/courses/`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const getCourse = async (id: string) => {
  const response = await axiosInstance.get<Course>(`/courses/c/${id}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const createCourse = async (course: Course) => {
  const response = await axiosInstance.post("/courses", course, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const joinCourse = async (data: { email: string; courseId: string }) => {
  const response = await axiosInstance.put(
    `/courses/join/${data.courseId}`,
    { email: data.email },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

export const getCoursePeople = async (id: string) => {
  const response = await axiosInstance.get<CoursePeople>(
    `/courses/c/${id}/people`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

export const getSearchedPeople = async (id: string, data: string) => {
  if (data === "") {
    return { users: [] };
  }
  const response = await axiosInstance.get<SearchedUserType>(
    `/courses/c/${id}/people/search/${data}`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

export const addPeopleToCourse = async (data: AddCoursePeopleType) => {
  const response = await axiosInstance.put(
    `/courses/c/${data.id}/people/add`,
    { users: data.users, type: data.type },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
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
};
