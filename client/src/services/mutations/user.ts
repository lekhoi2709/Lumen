import { useMutation } from "@tanstack/react-query";
import { deleteUser, updateProfile } from "../api/auth-api";
import { toast } from "@/components/ui/use-toast";

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data: { firstName?: string; lastName?: string }) =>
      updateProfile(data),
    onMutate: () => {
      console.log("mutate");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response.data.message,
      });
    },
    onSuccess: (data) => {
      toast({
        title: data.message,
        description: "Profile updated",
      });
    },
    onSettled: () => {},
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => deleteUser(),
    onMutate: () => {
      console.log("mutate");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response.data.message,
      });
    },
    onSuccess: (data) => {
      toast({
        title: data.message,
        description: "Account deleted",
      });
    },
    onSettled: () => {},
  });
}
