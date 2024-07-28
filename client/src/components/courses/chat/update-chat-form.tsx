import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "./chatform-layout";
import { useUpdatePost } from "@/services/mutations/posts";
import { PostType } from "@/types/post";

const formSchema = z.object({
  text: z.string().min(1),
  images: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string(),
      }),
    )
    .optional(),
  videos: z
    .array(
      z.object({
        src: z.string(),
        thumbnail: z.string(),
      }),
    )
    .optional(),
});

function UpdateChatForm({ postId }: { postId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      images: [],
      videos: [],
    },
    mode: "onBlur",
  });
  const updatePostMutation = useUpdatePost();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    let type = PostType.Text;

    if (
      (data.images?.length && data.videos?.length) ||
      (data.images?.length && data.text) ||
      (data.videos?.length && data.text)
    ) {
      type = PostType.Mixed;
    }

    if (data.images?.length) {
      type = PostType.Image;
    }

    if (data.videos?.length) {
      type = PostType.Video;
    }

    await updatePostMutation.mutate({
      postId,
      postData: {
        ...data,
        type,
      },
    });
  }

  return <FormLayout form={form} onSubmit={onSubmit} />;
}

export default UpdateChatForm;
