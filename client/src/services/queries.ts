import { useQuery } from "@tanstack/react-query";
import { verifyRefreshToken } from "./api";

export function useUserProfile() {
  return useQuery({
    queryKey: ["user"],
    queryFn: verifyRefreshToken,
  });
}
