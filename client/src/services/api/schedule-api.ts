import { axiosInstance } from "@/services/api/axios-instance";

export const fetchSchedulesAndAssignments = async () => {
  const response = await axiosInstance.get("/schedules/", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

  return response.data;
};
