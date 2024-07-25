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
import { verifyOTP, sendOTP } from "@/services/api/auth-api";

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
    await verifyOTP(data.email, data.otp)
      .then((res) => {
        sessionStorage.setItem("token", res.token);
        sessionStorage.setItem("email", form.getValues("email"));
        toast({
          title: res.message,
          description: "You will be redirected to the next step..",
        });
        navigate("/reset-password");
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: err.response.data.message || err.message,
        });
      });
  };

  const handleSendOTP = async () => {
    setLoading(true);
    await sendOTP(form.getValues("email"))
      .then((res) => {
        setLoading(false);
        toast({
          title: res.message,
          description: "Please check your e-mail for the OTP.",
        });
        setIsCounting(true);
      })
      .catch((err) => {
        setLoading(false);
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
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("forgot.email")}</FormLabel>
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
                <FormItem className="flex w-full flex-col items-center gap-1">
                  <FormLabel className="self-start">OTP</FormLabel>
                  <div className="flex flex-col gap-4 md:flex-row md:gap-2 md:self-end">
                    <FormControl>
                      <InputOTP {...field} maxLength={6}>
                        <InputOTPGroup>
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="h-9 w-9 bg-accent dark:bg-accent/40 md:h-10 md:w-10"
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
                        t("forgot.send")
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
            className="w-full py-6 transition-transform duration-500 ease-in-out hover:scale-[1.03]"
          >
            {isSubmitting ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              t("forgot.next")
            )}
          </Button>
        </form>
      </Form>
      <Toaster />
    </AuthLayout>
  );
}

export default ForgotPassword;
