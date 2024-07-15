import axios from "axios";
import { Profile, User } from "@/types/user";

const BASE_URL = process.env.API_URL;
const axiosInstance = axios.create({ baseURL: BASE_URL });

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
