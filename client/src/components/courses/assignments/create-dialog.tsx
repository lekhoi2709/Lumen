import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import FormLayout from "../chat/chatform-layout";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Dispatch, SetStateAction, useState } from "react";
import { PostType } from "@/types/post";
import { uploadFiles } from "@/services/api/posts-api";
import { isDocumentFile, isImageFile, isVideoFile } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { useCreatePost } from "@/services/mutations/posts";

export function CreateAssignmentDialog({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { t } = useTranslation();
  return (
    <DialogContent className="rounded-lg border-none bg-transparent p-4 font-nunito lg:max-w-[50rem]">
      <div className="flex h-full w-full max-w-[calc(100vw-2rem)] flex-col gap-4 rounded-lg border border-border bg-background p-6">
        <DialogHeader>
          <DialogTitle>{t("courses.assignments.title")}</DialogTitle>
          <DialogDescription className="hidden">
            Create a new assignment
          </DialogDescription>
        </DialogHeader>
        <CreateAssignmentForm setIsOpen={setIsOpen} />
      </div>
    </DialogContent>
  );
}

const formSchema = z.object({
  title: z.string().min(1),
  text: z.string(),
  files: z.array(
    z.object({
      src: z.string(),
      name: z.string(),
    }),
  ),
});

function CreateAssignmentForm({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      files: [],
    },
    mode: "onBlur",
  });
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const createPostMutation = useCreatePost();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      let type = PostType.Assignment;
      if (files && files.length > 0) {
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

          data.files.push(...images, ...videos, ...documents);
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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response.data.message,
      });
      console.error(error);
    }
  }
  return (
    <FormLayout
      formType="assignment"
      files={files}
      setFiles={setFiles}
      form={form}
      onSubmit={onSubmit}
    />
  );
}

export default CreateAssignmentDialog;
