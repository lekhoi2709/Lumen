import { axiosInstance } from "@/services/api/axios-instance";
import { Course, CoursePeople, AddCoursePeopleType } from "@/types/course";
import { SearchedUserType } from "@/types/user";

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
    },
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
    },
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
    },
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
export const updateCourse = async (course: Course) => {
  const response = await axiosInstance.put(
    `/courses/c/${course._id}/update`,
    course,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};

export const deleteCourse = async (id: string) => {
  const response = await axiosInstance.delete(`/courses/c/${id}/delete`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};
