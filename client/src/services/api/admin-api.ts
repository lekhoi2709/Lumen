import { axiosInstance } from "@/services/api/axios-instance";

export const getDashboardStats = async () => {
  const response = await axiosInstance.get("admin/dashboard-stats", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const getUsersList = async () => {
  const response = await axiosInstance.get("admin/users", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const getCoursesList = async () => {
  const response = await axiosInstance.get("admin/courses", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const editUserRole = async (userId: string, newRole: string) => {
  const response = await axiosInstance.put(
    `/admin/users/${userId}/edit-role`,
    { newRole },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};

export const updateUser = async (userId: string, userData: any) => {
  const response = await axiosInstance.put(`/admin/users/${userId}`, userData, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axiosInstance.delete(`/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const updateCourse = async (courseId: string, courseData: any) => {
  const response = await axiosInstance.put(
    `/admin/courses/${courseId}`,
    courseData,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};

export const deleteCourse = async (courseId: string) => {
  const response = await axiosInstance.delete(`/admin/courses/${courseId}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  return response.data;
};
