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
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";

const formSchema = z
  .object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
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

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        lastName: data.lastName,
        firstName: data.firstName,
        avatarUrl: "default-avatar",
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Account created successfully!");
        form.reset();
      } else {
        const error = await response.json();
        alert(error.message);
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
          className="bg-background rounded-lg drop-shadow-xl shadow-xl min-w-2/3 min-h-1/2 w-2/3 lg:w-1/3 flex flex-col p-8 py-12 lg:p-14 lg:py-16 items-center font-sans gap-8 lg:gap-12"
        >
          <h1 className="text-xl lg:text-2xl font-bold">Sign Up</h1>
          <section className="w-full flex flex-col gap-4 lg:gap-6">
            <section className="w-full flex flex-col gap-3">
              <FormLabel>Full Name</FormLabel>
              <div className="flex flex-col lg:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
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
                        <Input placeholder="Last Name" {...field} />
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
                    <Input placeholder="E-mail" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Password" {...field} />
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
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Confirm Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
          <Button type="submit" className="w-full py-6">
            Create Account
          </Button>
          <FormDescription>
            Already have an account?{" "}
            <a
              href="/login"
              className="cursor-pointer font-bold text-foreground"
            >
              Sign In
            </a>
          </FormDescription>
        </form>
      </Form>
    </AuthLayout>
  );
}

export default SignUp;
