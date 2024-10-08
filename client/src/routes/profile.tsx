import Layout from "@/layouts/layout";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2Icon } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDeleteAccount, useUpdateProfile } from "@/services/mutations/user";
import ChangeAvatarDialog from "@/components/change-avatar-dialog";

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
  const { user, logoutAct } = useAuth();
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
  const [isDeleting, setIsDeleting] = useState(false);
  const { isValid, isDirty, isSubmitting } = form.formState;
  const updateProfileMutation = useUpdateProfile();
  const deleteUserMutation = useDeleteAccount();

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

  const onDeleteUser = async () => {
    setIsDeleting(true);
    await deleteUserMutation.mutateAsync();
    setIsDeleting(false);
    const timeout = setTimeout(() => {
      logoutAct();
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
                <ChangeAvatarDialog />
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
            <div className="flex w-full items-center justify-between md:w-1/2">
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
            <div className="w-full rounded-md border p-6 md:w-1/2">
              <h1 className="mb-6 text-lg">{t("profile.danger-zone")}</h1>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" className="w-fit">
                    {t("profile.delete-account")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t("profile.delete-account-confirm")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("profile.delete-account-description")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {t("profile.delete-account-cancel")}
                    </AlertDialogCancel>
                    <Button
                      variant="destructive"
                      type="button"
                      onClick={onDeleteUser}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting && <Loader2Icon className="animate-spin" />}
                      {!isDeleting && t("profile.delete-account-btn")}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
