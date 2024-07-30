import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { PostType } from "@/types/post";
import { useAuth } from "@/contexts/auth-context";
import { useCreatePost } from "@/services/mutations/posts";
import FormLayout from "./chatform-layout";
import { Dispatch, useState } from "react";
import { uploadFiles } from "@/services/api/posts-api";
import { isDocumentFile, isImageFile, isVideoFile } from "@/lib/utils";

const formSchema = z.object({
  text: z.string().min(1),
  images: z
    .array(
      z.object({
        src: z.string(),
        name: z.string(),
      }),
    )
    .optional(),
  videos: z
    .array(
      z.object({
        src: z.string(),
        name: z.string(),
      }),
    )
    .optional(),
  documents: z.array(
    z.object({
      src: z.string(),
      name: z.string(),
    }),
  ),
});

function ChatForm({ setIsOpen }: { setIsOpen: Dispatch<boolean> }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      images: [],
      videos: [],
      documents: [],
    },
    mode: "onBlur",
  });
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const createPostMutation = useCreatePost();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    let type = PostType.Mixed;

    const response = await uploadFiles({ courseId: id!, files });
    if (response.urls && response.urls.length > 0) {
      const fileNames = response.urls.map((url: string) => {
        const name = url.split("/").pop();
        return { name, src: url };
      });

      const images: { name: string; src: string }[] = fileNames.filter(
        (file: { name: string; src: string }) => isImageFile(file.name),
      );
      const videos: { name: string; src: string }[] = fileNames.filter(
        (file: { name: string; src: string }) => isVideoFile(file.name),
      );

      const documents: { name: string; src: string }[] = fileNames.filter(
        (file: { name: string; src: string }) => isDocumentFile(file.name),
      );

      if (images) {
        data.images = images;
      }

      if (videos) {
        data.videos = videos;
      }

      if (documents) {
        data.documents = documents;
      }
    }

    createPostMutation.mutate({
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

    setIsOpen(false);
  }

  return (
    <FormLayout
      formType="announce"
      files={files}
      setFiles={setFiles}
      form={form}
      onSubmit={onSubmit}
    />
  );
}

export default ChatForm;
