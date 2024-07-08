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
import axios from "axios";

const formSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6).trim(),
});

function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const auth = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isDirty, isValid, isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const payload = {
      email: data.email,
      password: data.password,
    };
    await axios
      .post(`${process.env.API_URL}/auth/login/`, payload)
      .then((res) => {
        if (res.data.token && res.data.user) {
          auth.loginAct(res.data);
        } else {
          toast({
            variant: "destructive",
            description: res.data.message,
          });
        }
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          description: err.response.data.message,
        });
      });
  }

  return (
    <AuthLayout>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-background dark:bg-background/80 transition-colors duration-500 backdrop-blur-md rounded-lg drop-shadow-xl shadow-xl min-w-2/3 min-h-1/2 w-2/3 lg:w-1/3 flex flex-col p-8 py-12 lg:p-14 lg:py-16 items-center font-sans gap-8 lg:gap-12"
        >
          <h1 className="text-xl lg:text-2xl font-bold text-center">
            {t("login.title")}
          </h1>
          <section className="w-full flex flex-col gap-4 lg:gap-6">
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
          <div className="w-full flex flex-col gap-4 md:gap-6 justify-between items-center">
            <Button
              type="submit"
              disabled={!isDirty || !isValid || isSubmitting}
              className="w-full py-6 transition-transform duration-500 hover:scale-[1.03] ease-in-out text-xs md:text-base"
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
