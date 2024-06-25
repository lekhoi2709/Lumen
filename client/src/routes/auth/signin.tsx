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

const formSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6).trim(),
});

function SignIn() {
  const auth = useAuth();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const payload = {
        email: data.email,
        password: data.password,
      };

      const response = await fetch(`${process.env.API_URL}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.token && result.user) {
        auth.loginAct(result);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AuthLayout>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-background dark:bg-background/80 transition-colors duration-500 backdrop-blur-md rounded-lg drop-shadow-xl shadow-xl min-w-2/3 min-h-1/2 w-2/3 lg:w-1/3 flex flex-col p-8 py-12 lg:p-14 lg:py-16 items-center font-sans gap-8 lg:gap-12"
        >
          <h1 className="text-xl lg:text-2xl font-bold">{t("login.title")}</h1>
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
                      href="#"
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
          <Button
            type="submit"
            className="w-full py-6 transition-transform duration-500 hover:scale-[1.03] ease-in-out"
          >
            {t("login.signin")}
          </Button>
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
    </AuthLayout>
  );
}

export default SignIn;
