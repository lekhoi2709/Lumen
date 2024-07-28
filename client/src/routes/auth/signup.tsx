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
import { register } from "@/services/api/auth-api";
import { User } from "@/types/user";

enum RoleType {
  Student = "Student",
  Teacher = "Teacher",
}

const formSchema = z
  .object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    role: z.nativeEnum(RoleType),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    },
  );

function SignUp() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: RoleType.Student,
    },
    mode: "onBlur",
  });

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isDirty, isValid, isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const payload: User = {
      email: data.email,
      password: data.password,
      lastName: data.lastName,
      firstName: data.firstName,
      avatarUrl: "default-avatar",
      role: data.role,
    };

    await register(payload)
      .then((res) => {
        toast({
          title: res.message,
          description: "Please login to continue",
        });
        navigate("/login");
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
          <h1 className="text-xl font-bold lg:text-2xl">
            {t("register.title")}
          </h1>
          <section className="flex w-full flex-col gap-4 lg:gap-6">
            <section className="flex w-full flex-col gap-3">
              <FormLabel>{t("register.fullName")}</FormLabel>
              <div className="flex flex-col gap-4 lg:flex-row">
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
                      <SelectTrigger className="bg-accent placeholder:text-black dark:bg-accent/40">
                        <SelectValue
                          placeholder={t("register.role-placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={RoleType.Student}>
                        {t("register.student")}
                      </SelectItem>
                      <SelectItem value={RoleType.Teacher}>
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
            className="w-full py-6 transition-transform duration-500 ease-in-out hover:scale-[1.03]"
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
