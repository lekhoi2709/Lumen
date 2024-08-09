import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdatePost } from "@/services/mutations/posts";
import { PostType } from "@/types/post";
import { Dispatch } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import TipTapRichTextEditor from "./tiptap-editor";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { DateTimePicker } from "@/components/datetime-picker";

const formSchema = z.object({
  title: z.string(),
  text: z.string(),
  dueDate: z.date().optional(),
});

function UpdateChatForm({
  updateType,
  postId,
  setIsOpen,
}: {
  updateType?: "Post" | "Assignment";
  postId: string;
  setIsOpen: Dispatch<boolean>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      text: "",
      dueDate: undefined,
    },
    mode: "onBlur",
  });
  const updatePostMutation = useUpdatePost();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    let type = updateType === "Post" ? PostType.Post : PostType.Assignment;

    updatePostMutation.mutate({
      postId,
      postData: {
        dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
        ...data,
        type,
      },
    });
    setIsOpen(false);
  }

  return <UpdateForm formType={updateType!} form={form} onSubmit={onSubmit} />;
}

function UpdateForm({
  formType,
  form,
  onSubmit,
}: {
  formType: "Post" | "Assignment";
  form: UseFormReturn<any>;
  onSubmit: any;
}) {
  const { t } = useTranslation();
  const editorPlaceholder =
    (formType === "Post" && t("courses.overview.chat-placeholder")) ||
    (formType === "Assignment" &&
      t("courses.assignments.description-placeholder")) ||
    t("courses.overview.comment-placeholder");
  const { isValid, isSubmitting, isDirty } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full max-h-[80vh] w-full flex-col items-center justify-center gap-2 md:h-fit md:max-h-[60vh] md:gap-4"
      >
        {formType === "Assignment" && (
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full max-w-[50rem]">
                <FormLabel className="hidden">Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder={t("courses.assignments.name-placeholder")}
                    className="h-full max-h-12 overflow-y-auto rounded-t-md border-b border-border bg-accent p-2 py-4 font-nunito text-muted-foreground dark:bg-accent/40"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="w-full max-w-[50rem]">
              <FormLabel className="hidden">Message</FormLabel>
              <FormControl>
                <TipTapRichTextEditor
                  data={field.value || ""}
                  onChange={field.onChange}
                  placeholder={editorPlaceholder}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {formType === "Assignment" && (
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="w-full max-w-[50rem]">
                <FormLabel className="hidden">Due Date</FormLabel>
                <FormControl>
                  <DateTimePicker
                    placeholder={t("courses.assignments.due-date-des")}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <div className="mt-2 flex w-full flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex w-full justify-end gap-2 md:flex-row">
            <DialogClose asChild>
              <Button variant="outline" className="hidden md:block">
                {t("courses.dialog.cancel")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-full md:w-fit"
              disabled={!isValid || isSubmitting || !isDirty}
            >
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              {!isSubmitting && t("courses.overview.chat-btn")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default UpdateChatForm;
