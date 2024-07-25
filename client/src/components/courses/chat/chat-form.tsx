import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TipTapRichTextEditor from "./tiptap-editor";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  data: z.string().min(1),
});

function ChatForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: "",
    },
    mode: "onBlur",
  });
  const { t } = useTranslation();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full h-full flex flex-col gap-4 md:gap-6 items-center justify-center"
      >
        <FormField
          control={form.control}
          name="data"
          render={({ field }) => (
            <FormItem className="w-full max-w-[50rem]">
              <FormLabel className="hidden">Message</FormLabel>
              <FormControl>
                <TipTapRichTextEditor
                  data={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex w-full md:flex-row gap-2 justify-end">
          <DialogClose asChild>
            <Button variant="outline" className="hidden md:block">
              {t("courses.dialog.cancel")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" className="w-full md:w-fit">
              {t("courses.overview.chat-btn")}
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
}

export default ChatForm;
