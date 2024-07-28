import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { useCourse } from "@/services/queries/courses";
import { CourseCode } from "./overview";
import { useDeleteCourse, useUpdateCourse } from "@/services/mutations/courses";
import { useAuth } from "@/contexts/auth-context";

function UpdateCourseDialog({
  device = "desktop",
}: {
  device?: "desktop" | "mobile";
}) {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={twMerge(
            "h-full px-2 md:block",
            device === "desktop" ? "hidden" : "md:hidden",
          )}
        >
          <SettingsIcon className="h-6 w-6 text-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen flex h-screen w-screen flex-col gap-6 !rounded-none">
        <DialogHeader className="mt-2">
          <DialogTitle>
            {t("courses.overview.course-setting.title")}
          </DialogTitle>
          <DialogDescription className="hidden">
            Courses Setting
          </DialogDescription>
        </DialogHeader>
        <UpdateCoursesForm />
      </DialogContent>
    </Dialog>
  );
}

const formSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

function UpdateCoursesForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const courseQuery = useCourse(id!);
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: courseQuery.data?.title,
      description: courseQuery.data?.description,
    },
    mode: "onBlur",
  });

  const { isDirty, isValid, isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const payload: any = {
      _id: courseQuery.data?._id,
      title: data.title,
      description: data.description,
    };
    updateCourseMutation.mutate(payload);
    form.reset();
  }

  async function onDelete() {
    deleteCourseMutation.mutate(courseQuery.data?._id!);
    localStorage.setItem("history", "/courses");
    navigate("/courses");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <section className="flex w-full flex-col gap-6 self-center rounded-md border border-border p-6 px-8 md:max-w-[50%]">
          <h1 className="text-xl">
            {t("courses.overview.course-setting.details")}
          </h1>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-sm">
                  {t("courses.dialog.name")}
                </FormLabel>
                <FormDescription className="hidden text-sm text-muted-foreground">
                  {t("courses.dialog.course-des")}
                </FormDescription>
                <FormControl className="mt-0">
                  <Input
                    placeholder={courseQuery.data?.title}
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
              <FormItem className="my-2 flex flex-col gap-1">
                <FormLabel className="text-sm">
                  {t("courses.dialog.course-des-placeholder")}
                </FormLabel>
                <FormDescription className="hidden text-sm text-muted-foreground">
                  {t("courses.dialog.course-des")}
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder={courseQuery.data?.description}
                    className="py-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="hidden" />
              </FormItem>
            )}
          />
        </section>
        <CourseCode
          className="w-full self-center rounded-md md:!max-w-[50%]"
          code={courseQuery.data?._id!}
          t={t}
        />
        {user?.email === courseQuery.data?.createdUserEmail && (
          <section className="flex w-full flex-col gap-6 self-center rounded-md border border-border p-6 px-8 md:max-w-[50%]">
            <h1>{t("courses.overview.course-setting.delete")}</h1>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" className="w-fit">
                  {t("courses.overview.course-setting.delete-btn")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("courses.overview.course-setting.delete-confirm")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("courses.overview.course-setting.delete-description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t("courses.overview.course-setting.delete-cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      variant="destructive"
                      type="button"
                      onClick={onDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {t("courses.overview.course-setting.delete-btn")}
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </section>
        )}
        <div className="flex w-full justify-end self-center md:max-w-[50%]">
          <DialogClose asChild>
            <Button
              type="submit"
              className="w-fit"
              disabled={!isDirty || !isValid || isSubmitting}
            >
              {t("courses.overview.course-setting.save")}
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
}

export default UpdateCourseDialog;
