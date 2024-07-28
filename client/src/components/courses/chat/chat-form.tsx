import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { PostType } from "@/types/post";
import { useAuth } from "@/contexts/auth-context";
import { useCreatePost } from "@/services/mutations/posts";
import FormLayout from "./chatform-layout";

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

function ChatForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      images: [],
      videos: [],
    },
    mode: "onBlur",
  });
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const createPostMutation = useCreatePost();

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

    await createPostMutation.mutate({
      courseId: id!,
      postData: {
        ...data,
        type,
        user: {
          email: user?.email!,
          firstName: user?.firstName!,
          lastName: user?.lastName!,
          avatarUrl: user?.avatarUrl!,
        },
      },
    });
  }

  return <FormLayout form={form} onSubmit={onSubmit} />;
}

export default ChatForm;
