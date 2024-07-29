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

function FormLayout({
  form,
  onSubmit,
}: {
  form: UseFormReturn<any>;
  onSubmit: any;
}) {
  const { t } = useTranslation();
  const { isValid, isSubmitting, isDirty } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col items-center justify-center gap-4 md:gap-6"
      >
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
                />
              </FormControl>
            </FormItem>
          )}
        />
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
              disabled={!isValid || isSubmitting || !isDirty}
            >
              {t("courses.overview.chat-btn")}
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
}

export default FormLayout;
