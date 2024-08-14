import axios from "axios";
import { isTauri } from "@/lib/utils";

const isRunningInTauri = isTauri() !== undefined;

const BASE_URL = isRunningInTauri
  ? (import.meta.env.VITE_API_URL as string)
  : process.env.API_URL;
export const axiosInstance = axios.create({ baseURL: BASE_URL });
