import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTranslation } from "react-i18next";
import { User } from "@/types/user";
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
import { useCreateCourse } from "@/services/mutations/courses";

const formSchema = z.object({
  title: z.string().trim(),
  description: z.string().trim(),
});

function CreateCourse({ user }: { user: User | null }) {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onBlur",
  });

  const { isDirty, isValid, isSubmitting } = form.formState;
  const createCourseMutation = useCreateCourse();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const payload: any = {
      title: data.title,
      description: data.description,
      instructor: {
        name: user!.firstName + " " + user!.lastName,
        email: user!.email,
      },
    };
    await createCourseMutation.mutateAsync(payload);
    form.reset();
    window.location.reload();
  }

  return (
    <DialogContent className="rounded-lg border-none bg-transparent p-4 font-nunito">
      <div className="flex h-full w-full flex-col gap-6 rounded-lg border border-border bg-background p-6">
        <DialogHeader>
          <DialogTitle>{t("courses.dialog.create")}</DialogTitle>
          <DialogDescription className="hidden">
            Join a class by entering
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <section className="flex flex-col gap-4 rounded-md border border-border p-4 py-6">
              <p className="text-sm text-muted-foreground">
                {t("courses.dialog.description")}
              </p>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={user!.avatarUrl} alt="User avatar" />
                  <AvatarFallback>
                    {user!.firstName.split("")[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {user!.firstName} {user!.lastName} -{" "}
                    {user?.role === "Teacher" && t("register.teacher")}
                    {user?.role === "Student" && t("register.student")}
                  </p>
                  <p className="text-xs text-muted-foreground">{user!.email}</p>
                </div>
              </div>
            </section>
            <section className="flex flex-col gap-2 rounded-md border border-border p-4 py-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-4">
                    <div>
                      <FormLabel className="text-sm">
                        {t("courses.dialog.name")}
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground">
                        {t("courses.dialog.name-des")}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Input
                        placeholder={t("courses.dialog.name")}
                        className="py-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="hidden" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-4">
                    <div className="hidden">
                      <FormLabel className="text-sm">
                        {t("courses.dialog.course-des")}
                      </FormLabel>
                      <FormDescription className="text-sm text-muted-foreground">
                        {t("courses.dialog.course-des")}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Input
                        placeholder={t("courses.dialog.course-des-placeholder")}
                        className="py-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="hidden" />
                  </FormItem>
                )}
              />
            </section>
            <div className="flex w-full justify-end gap-2 md:flex-row">
              <DialogClose asChild>
                <Button variant="outline" className="hidden md:block">
                  {t("courses.dialog.cancel")}
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  type="submit"
                  className="w-full md:w-fit"
                  disabled={!isDirty || !isValid || isSubmitting}
                >
                  {t("courses.dialog.create-btn")}
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
}

export default CreateCourse;
