import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/auth-layout";
import { PasswordInput } from "@/components/password-input";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Loader2Icon } from "lucide-react";
import GoogleButton from "@/components/google-button";
import { login } from "@/services/api/auth-api";

const formSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6).trim(),
});

function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const { loginAct } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isDirty, isValid, isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await login(data.email, data.password)
      .then((res) => {
        if (res.token) {
          return loginAct(res);
        }
        throw new Error("Invalid response");
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          description: err.response.data.message || err.message,
        });
      });
  }

  return (
    <AuthLayout>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="min-w-2/3 min-h-1/2 flex w-2/3 flex-col items-center gap-8 rounded-lg bg-background p-8 py-12 font-sans shadow-xl drop-shadow-xl backdrop-blur-md transition-colors duration-500 dark:bg-background/80 lg:w-1/3 lg:gap-12 lg:p-14 lg:py-16"
        >
          <h1 className="text-center text-xl font-bold lg:text-2xl">
            {t("login.title")}
          </h1>
          <section className="flex w-full flex-col gap-4 lg:gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E-mail"
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
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("login.password")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("login.password")}
                      className="bg-accent dark:bg-accent/40"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <a
                      href="/verify-user"
                      className="cursor-pointer font-bold text-foreground"
                    >
                      {t("login.forgotPassword")}
                    </a>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
          <div className="flex w-full flex-col items-center justify-between gap-4 md:gap-6">
            <Button
              type="submit"
              disabled={!isDirty || !isValid || isSubmitting}
              className="w-full py-6 text-xs transition-transform duration-500 ease-in-out hover:scale-[1.03] md:text-base"
            >
              {isSubmitting ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                t("login.signin")
              )}
            </Button>
            <p>{t("login.or")}</p>
            <GoogleButton />
          </div>
          <FormDescription>
            {t("login.noAccount")}{" "}
            <Link
              to="/register"
              className="cursor-pointer font-bold text-foreground transition-colors duration-500 hover:text-blue-500"
            >
              {t("login.register")}
            </Link>
          </FormDescription>
        </form>
      </Form>
      <Toaster />
    </AuthLayout>
  );
}

export default SignIn;
