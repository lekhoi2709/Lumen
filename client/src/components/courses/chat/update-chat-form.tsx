import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "./chatform-layout";
import { useUpdatePost } from "@/services/mutations/posts";
import { PostType } from "@/types/post";
import { Dispatch } from "react";

const formSchema = z.object({
  text: z.string().min(1),
});

function UpdateChatForm({
  postId,
  setIsOpen,
}: {
  postId: string;
  setIsOpen: Dispatch<boolean>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
    mode: "onBlur",
  });
  const updatePostMutation = useUpdatePost();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    let type = PostType.Text;

    await updatePostMutation.mutate({
      postId,
      postData: {
        ...data,
        type,
      },
    });
    setIsOpen(false);
  }

  return <FormLayout formType="comment" form={form} onSubmit={onSubmit} />;
}

export default UpdateChatForm;
