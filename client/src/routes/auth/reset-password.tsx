import AuthLayout from "@/layouts/auth-layout";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Loader2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "@/services/api/auth-api";

const formSchema = z
  .object({
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine(
    (values) => {
      return values.newPassword === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    },
  );

function ResetPassword() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const { isValid, isDirty, isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await resetPassword(sessionStorage.getItem("email")!, data.newPassword)
      .then((res) => {
        toast({
          title: res.message,
          description: "You can now login with your new password.",
        });
        sessionStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: err.response.data.message || err.message,
        });
      });
  };

  return (
    <AuthLayout>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="min-w-2/3 min-h-1/2 flex w-2/3 flex-col items-center gap-8 rounded-lg bg-background p-8 py-12 font-sans shadow-xl drop-shadow-xl backdrop-blur-md transition-colors duration-500 dark:bg-background/80 lg:w-1/3 lg:gap-12 lg:p-14 lg:py-16"
        >
          <h1 className="text-xl font-bold lg:text-2xl">{t("forgot.title")}</h1>
          <section className="flex w-full flex-col gap-4 lg:gap-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("forgot.newPass")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("forgot.newPass")}
                      className="bg-accent dark:bg-accent/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("register.confirmPassword")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("register.confirmPassword")}
                      className="bg-accent dark:bg-accent/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
          <Button
            type="submit"
            disabled={!isValid || !isDirty || isSubmitting}
            className="w-full py-6 transition-transform duration-500 ease-in-out hover:scale-[1.03]"
          >
            {isSubmitting ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              t("forgot.reset")
            )}
          </Button>
        </form>
      </Form>
      <Toaster />
    </AuthLayout>
  );
}

export default ResetPassword;
