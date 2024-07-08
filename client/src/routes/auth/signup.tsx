import AuthLayout from "@/layouts/auth-layout";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Loader2Icon } from "lucide-react";
import axios from "axios";

const formSchema = z
  .object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    role: z.string().optional(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }
  );

function SignUp() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isDirty, isValid, isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const payload = {
      email: data.email,
      password: data.password,
      lastName: data.lastName,
      firstName: data.firstName,
      avatarUrl: "default-avatar",
      role: data.role,
    };

    await axios
      .post(`${process.env.API_URL}/auth/register/`, payload)
      .then((res) => {
        toast({
          title: res.data.message,
          description: "Please login to continue",
        });
        navigate("/login");
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
          <h1 className="text-xl lg:text-2xl font-bold">
            {t("register.title")}
          </h1>
          <section className="w-full flex flex-col gap-4 lg:gap-6">
            <section className="w-full flex flex-col gap-3">
              <FormLabel>{t("register.fullName")}</FormLabel>
              <div className="flex flex-col lg:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder={t("register.firstName")}
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder={t("register.lastName")}
                          className="bg-accent dark:bg-accent/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("register.email")}
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("register.role")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-accent dark:bg-accent/40 placeholder:text-black">
                        <SelectValue
                          placeholder={t("register.role-placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Student">
                        {t("register.student")}
                      </SelectItem>
                      <SelectItem value="Teacher">
                        {t("register.teacher")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("register.password")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("register.password")}
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
            disabled={!isDirty || !isValid || isSubmitting}
            className="w-full py-6 transition-transform duration-500 hover:scale-[1.03] ease-in-out"
          >
            {isSubmitting ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              t("register.signup")
            )}
          </Button>
          <FormDescription>
            {t("register.alreadyHaveAccount")}{" "}
            <Link
              to="/login"
              className="cursor-pointer font-bold text-foreground transition-colors duration-500 hover:text-blue-500"
            >
              {t("register.login")}
            </Link>
          </FormDescription>
        </form>
      </Form>
      <Toaster />
    </AuthLayout>
  );
}

export default SignUp;
