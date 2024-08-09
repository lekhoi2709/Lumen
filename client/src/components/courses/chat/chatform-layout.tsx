import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import TipTapRichTextEditor from "./tiptap-editor";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";
import UploadButton from "@/components/upload";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Dispatch, SetStateAction } from "react";
import { Loader2Icon } from "lucide-react";
import { isDocumentFile, isImageFile, isVideoFile } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/datetime-picker";

function FormLayout({
  formType,
  files,
  setFiles,
  form,
  onSubmit,
}: {
  formType: "announce" | "comment" | "assignment";
  files?: File[];
  setFiles?: Dispatch<SetStateAction<File[]>>;
  form: UseFormReturn<any>;
  onSubmit: any;
}) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { isValid, isSubmitting, isDirty } = form.formState;
  const userInCourseRole = user?.courses?.find(
    (course) => course.code === id,
  )?.role;
  const isTeacher =
    userInCourseRole === "Teacher" || userInCourseRole === "Assistant";
  const editorPlaceholder =
    (formType === "comment" && t("courses.overview.comment-placeholder")) ||
    (formType === "assignment" &&
      t("courses.assignments.description-placeholder")) ||
    t("courses.overview.chat-placeholder");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full max-h-[80vh] w-full flex-col items-center justify-center gap-2 md:h-fit md:max-h-[60vh] md:gap-4"
      >
        {formType === "assignment" && (
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
        {formType === "assignment" && (
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
        {(formType === "announce" || formType === "assignment") &&
          files &&
          files.length > 0 && (
            <ul className="flex max-h-[50%] w-full flex-wrap overflow-y-auto">
              <FilesList files={files} setFiles={setFiles!} />
            </ul>
          )}
        <div className="mt-2 flex w-full flex-col items-center justify-between gap-4 md:flex-row">
          {(formType === "announce" || formType === "assignment") &&
            isTeacher && <UploadButton files={files!} setFiles={setFiles!} />}
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

function FilesList({
  files,
  setFiles,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  const truncateFileName = (fileName: string) => {
    return fileName.split("/").pop() || fileName;
  };

  return files.map((file, index) => (
    <li
      key={index}
      className="xl:w-1/8 block h-32 w-1/2 p-2 sm:w-1/3 md:w-1/4 lg:w-1/6"
    >
      <article className="focus:shadow-outline group relative h-full w-full cursor-pointer rounded-md bg-gray-100 shadow-sm focus:outline-none">
        {isImageFile(file.name) && (
          <img
            alt="upload preview"
            className="img-preview h-full w-full rounded-md object-cover"
            src={URL.createObjectURL(file)}
          />
        )}
        {isVideoFile(file.name) && (
          <video
            src={URL.createObjectURL(file)}
            className="doc-preview h-full w-full rounded-md object-cover"
          />
        )}
        {isDocumentFile(file.name) && (
          <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-100 text-gray-500">
            <iframe
              referrerPolicy="no-referrer"
              src={URL.createObjectURL(file)}
              className="doc-preview h-full w-full rounded-md object-cover"
            />
          </div>
        )}
        <section className="absolute bottom-0 z-20 flex h-fit w-full flex-col break-words rounded-md bg-background/20 px-3 py-2 text-xs backdrop-blur-md">
          <div className="flex-1 truncate group-hover:text-blue-500">
            {truncateFileName(file.name)}
          </div>
          <div className="flex items-center justify-between">
            <p className="size text-xs text-muted-foreground">
              {file.size > 1024
                ? file.size > 1048576
                  ? Math.round(file.size / 1048576) + "mb"
                  : Math.round(file.size / 1024) + "kb"
                : file.size + "b"}
            </p>
            <button
              className="delete ml-auto rounded-md p-1 text-muted-foreground hover:bg-destructive hover:text-white focus:outline-none"
              onClick={() => {
                setFiles((prevFiles) =>
                  prevFiles.filter((_, i) => i !== index),
                );
              }}
            >
              <svg
                className="pointer-events-none ml-auto h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  className="pointer-events-none"
                  d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"
                />
              </svg>
            </button>
          </div>
        </section>
      </article>
    </li>
  ));
}

export default FormLayout;
