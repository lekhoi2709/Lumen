import AuthLayout from "@/layouts/auth-layout";
import { set, z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { Loader2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email().trim(),
  otp: z.string().min(6).max(6).trim(),
});

function ForgotPassword() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60 * 5);
  const [isCounting, setIsCounting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCounting) {
      const interval = setInterval(() => {
        setCountdown((prev: any) => prev - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isCounting]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const { isValid, isDirty, isSubmitting } = form.formState;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log(data);
      const response = await fetch(`${process.env.API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          otp: data.otp,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: result.message,
        });
        return;
      }

      sessionStorage.setItem("token", result.token);
      sessionStorage.setItem("email", form.getValues("email"));
      toast({
        title: result.message,
        description: "You can now login with your new password.",
      });
      navigate("/forgot-password-2");
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.API_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.getValues("email") }),
      });

      const result = await response.json();
      setLoading(false);
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: result.message,
        });
        return;
      }

      toast({
        title: result.message,
        description: "Please check your e-mail for the OTP.",
      });
      setIsCounting(true);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <AuthLayout>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-background dark:bg-background/80 transition-colors duration-500 backdrop-blur-md rounded-lg drop-shadow-xl shadow-xl min-w-2/3 min-h-1/2 w-2/3 lg:w-1/3 flex flex-col p-8 py-12 lg:p-14 lg:py-16 items-center font-sans gap-8 lg:gap-12"
        >
          <h1 className="text-xl lg:text-2xl font-bold">Forgot Password</h1>
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
              name="otp"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col gap-1 items-center">
                  <FormLabel className="self-start">OTP</FormLabel>
                  <div className="flex flex-col gap-4 md:gap-2 md:self-end md:flex-row">
                    <FormControl>
                      <InputOTP {...field} maxLength={6}>
                        <InputOTPGroup>
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="bg-accent dark:bg-accent/40 h-9 w-9 md:h-10 md:w-10"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <Button
                      className="w-fit self-end md:w-full"
                      disabled={isCounting}
                      type="button"
                      onClick={() => handleSendOTP()}
                    >
                      {loading ? (
                        <Loader2Icon className="animate-spin" />
                      ) : isCounting ? (
                        countdown
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
          <Button
            type="submit"
            disabled={!isValid || !isDirty || isSubmitting}
            className="w-full py-6 transition-transform duration-500 hover:scale-[1.03] ease-in-out"
          >
            {isSubmitting ? <Loader2Icon className="animate-spin" /> : "Next"}
          </Button>
        </form>
      </Form>
      <Toaster />
    </AuthLayout>
  );
}

export default ForgotPassword;
