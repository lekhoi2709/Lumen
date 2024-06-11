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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(50),
});

function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-background rounded-lg drop-shadow-xl shadow-xl min-w-2/3 w-2/3 lg:w-1/4 lg:h-1/2 flex flex-col p-8 py-12 lg:p-14 lg:py-16 items-center font-sans gap-6"
      >
        <h1 className="text-xl lg:text-2xl font-bold">Welcome back!</h1>
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
                <Input placeholder="Password" {...field} />
              </FormControl>
              <FormDescription>
                <a
                  href="#"
                  className="cursor-pointer font-bold text-foreground"
                >
                  Forgot a password?
                </a>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full py-6">
          Login
        </Button>
        <FormDescription>
          Don't have an account?{" "}
          <a href="#" className="cursor-pointer font-bold text-foreground">
            Sign Up
          </a>
        </FormDescription>
      </form>
    </Form>
  );
}

export default SignIn;
