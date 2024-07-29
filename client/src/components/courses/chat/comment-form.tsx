import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "./chatform-layout";
import { useCommentPost } from "@/services/mutations/posts";
import { useAuth } from "@/contexts/auth-context";

const formSchema = z.object({
  text: z.string().min(1),
});

function CommentForm({ postId }: { postId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
    mode: "onBlur",
  });
  const { user } = useAuth();
  const commentPostMutation = useCommentPost();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    commentPostMutation.mutate({
      postId,
      user: {
        email: user?.email!,
        firstName: user?.firstName!,
        lastName: user?.lastName!,
        avatarUrl: user?.avatarUrl!,
      },
      text: data.text,
    });
    form.reset();
  };

  return <FormLayout form={form} onSubmit={onSubmit} />;
}

export default CommentForm;
