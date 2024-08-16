import Layout from "@/layouts/layout";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CameraIcon, Loader2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUpdateProfile } from "@/services/mutations/user";

type TUserInput = {
  label: string;
  value: string;
  id: string;
  isEditing: { [key: string]: boolean };
  setIsEditing?: any;
  form: any;
};

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: "First name must be at least 2 characters long",
    })
    .optional(),
  lastName: z
    .string()
    .min(2, {
      message: "Last name must be at least 2 characters long",
    })
    .optional(),
  role: z.string().optional(),
});

function UserProfile() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      role: t(`register.${user?.role.toLowerCase()}`),
    },
    mode: "onBlur",
  });
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
  const { isValid, isDirty, isSubmitting } = form.formState;
  const updateProfileMutation = useUpdateProfile();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (
      values.firstName !== user?.firstName &&
      values.lastName !== user?.lastName
    ) {
      await updateProfileMutation.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
      });
    }
    if (values.firstName !== user?.firstName) {
      await updateProfileMutation.mutateAsync({ firstName: values.firstName });
    }
    if (values.lastName !== user?.lastName) {
      await updateProfileMutation.mutateAsync({ lastName: values.lastName });
    }

    const timeout = setTimeout(() => {
      window.location.reload();
    }, 1000);

    return () => clearTimeout(timeout);
  };

  return (
    <Layout footer={false}>
      <section className="relative z-0 flex w-full justify-center p-4 font-nunito md:pl-[16rem]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-screen w-full max-w-[60rem] flex-col items-center gap-6"
          >
            <div className="flex w-full flex-col items-center gap-4">
              <Avatar className="group relative h-32 w-32 border md:h-24 md:w-24">
                <AvatarImage src={user?.avatarUrl} alt={user?.email} />
                <AvatarFallback>{user?.firstName.at(0)}</AvatarFallback>
                <span className="absolute bottom-0 flex h-1/3 w-full cursor-pointer items-center justify-center gap-2 rounded-b-full bg-slate-500/10 text-orange-500 backdrop-blur-md transition-opacity duration-200 ease-in-out md:opacity-0 md:group-hover:opacity-100">
                  <CameraIcon className="h-6 w-6" />
                </span>
              </Avatar>
            </div>
            <h1 className="text-xl font-bold">{user?.email}</h1>
            <div className="flex w-full flex-col items-center gap-6 text-left">
              <UserInputField
                label={t("profile.firstName")}
                value={user?.firstName!}
                id="firstName"
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                form={form}
              />
              <UserInputField
                label={t("profile.lastName")}
                value={user?.lastName!}
                id="lastName"
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                form={form}
              />
              <UserInputField
                label={t("profile.role")}
                value={user?.role!}
                id="role"
                isEditing={isEditing}
                form={form}
              />
            </div>
            <div className="mt-8 flex w-full items-center justify-between md:w-1/2">
              <Button
                type="button"
                variant="outline"
                className="text-orange-500 hover:text-orange-700"
                onClick={() => navigate("/verify-user")}
              >
                {t("profile.change-password")}
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-700"
                disabled={!isDirty || !isValid || isSubmitting}
              >
                {!isSubmitting && t("profile.save")}
                {isSubmitting && <Loader2Icon className="animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </Layout>
  );
}

function UserInputField({
  label,
  value,
  id,
  isEditing,
  setIsEditing,
  form,
}: TUserInput) {
  const { t } = useTranslation();

  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col items-center gap-2">
          <FormLabel
            htmlFor={id}
            className="w-full font-bold first-line:text-left md:w-1/2"
          >
            {label}
          </FormLabel>
          <div className="flex w-full gap-2 md:w-1/2">
            <FormControl>
              <Input
                id={id}
                disabled={!isEditing[id]}
                placeholder={
                  id === "user-role"
                    ? t(`register.${value.toLowerCase()}`)
                    : value
                }
                {...field}
              />
            </FormControl>
            {id !== "role" && (
              <Button
                type="button"
                className="bg-orange-500 hover:bg-orange-700"
                onClick={() =>
                  setIsEditing &&
                  setIsEditing((prev: any) => ({ ...prev, [id]: !prev[id] }))
                }
              >
                {t("profile.edit")}
              </Button>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default UserProfile;
