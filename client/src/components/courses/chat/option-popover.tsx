import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  EllipsisVerticalIcon,
  Loader2Icon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useDeleteComment, useDeletePost } from "@/services/mutations/posts";
import UpdateChatForm from "./update-chat-form";
import { Dispatch, useState } from "react";
import { TUnionPost } from "@/types/post";
import { useNavigate, useParams } from "react-router-dom";
import { deleteFiles } from "@/services/api/posts-api";
import { toast } from "@/components/ui/use-toast";

function OptionPopover({
  type = "Post",
  isEditabel = true,
  className,
  postId,
  postData,
  commentId,
}: {
  type?: "Post" | "Comment" | "Assignment";
  isEditabel?: boolean;
  className?: string;
  postId: string;
  postData?: TUnionPost;
  commentId?: string;
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={twMerge("group p-2 hover:bg-orange-500/30", className)}
        >
          <EllipsisVerticalIcon className="h-5 w-5 text-muted-foreground group-hover:text-orange-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit max-w-[12rem] p-2 px-4 text-sm">
        <div className="flex flex-col">
          {(type === "Post" || type === "Assignment") && isEditabel && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center justify-start gap-4 rounded-sm hover:bg-muted"
                >
                  <PencilIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {t("courses.overview.edit-post")}
                  </span>
                </Button>
              </DialogTrigger>
              <EditDialog setIsOpen={setIsOpen} postId={postId} type={type} />
            </Dialog>
          )}
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-4 rounded-sm hover:bg-muted"
              >
                <TrashIcon className="h-4 w-4 text-destructive" />
                <span className="text-destructive">
                  {t("courses.overview.delete-post")}
                </span>
              </Button>
            </DialogTrigger>
            <DeleteDialog
              onOpenChange={setIsDeleteOpen}
              postId={postId}
              postData={postData}
              commentId={commentId}
            />
          </Dialog>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function DeleteDialog({
  postId,
  onOpenChange,
  postData,
  commentId,
}: {
  postId: string;
  onOpenChange: Dispatch<boolean>;
  postData?: TUnionPost;
  commentId?: string;
}) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const deletePost = useDeletePost();
  const deleteComment = useDeleteComment();
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const getModifiedFileNames = (post: TUnionPost) => {
    const fileNames = post.files?.map((file) => id + "/" + file.name);
    return fileNames;
  };

  const handlePostDelete = async () => {
    setIsDeleting(true);
    const fileNames = getModifiedFileNames(postData!);
    if (postData?.files && postData.files.length > 0) {
      await deleteFiles(fileNames!, id!)
        .then((_res) => {
          deletePost.mutate(postId);
        })
        .finally(() => {
          setIsDeleting(false);
          onOpenChange(false);
        })
        .catch((err) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: err.response.data.message,
          });
        });
    } else {
      deletePost.mutate(postId);
      setIsDeleting(false);
      onOpenChange(false);
    }
    navigate(sessionStorage.getItem("history") || `/courses/${id}`);
  };

  const handleCommentDelete = () => {
    deleteComment.mutate({ postId, commentId: commentId! });
  };

  return (
    <DialogContent className="rounded-lg border-none bg-transparent p-4 font-nunito md:max-w-[30rem] lg:max-w-[40rem]">
      <div className="flex h-full w-full flex-col gap-4 rounded-lg border border-border bg-background p-6">
        <DialogHeader>
          <DialogTitle>{t("courses.overview.delete-post")}</DialogTitle>
          <DialogDescription className="hidden">delete post</DialogDescription>
        </DialogHeader>
        <p>
          {t(
            commentId
              ? "courses.overview.delete-comment-confirm"
              : "courses.overview.delete-post-confirm",
          )}
        </p>
        <div className="mt-4 flex gap-4">
          <DialogClose asChild>
            <Button variant="ghost" className="w-full">
              {t("courses.dialog.cancel")}
            </Button>
          </DialogClose>
          <Button
            onClick={commentId ? handleCommentDelete : handlePostDelete}
            variant="destructive"
            className="w-full"
          >
            {isDeleting && <Loader2Icon className="animate-spin" />}
            {!isDeleting && t("courses.overview.delete-post")}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

function EditDialog({
  type,
  postId,
  setIsOpen,
}: {
  type: "Post" | "Assignment";
  postId: string;
  setIsOpen: Dispatch<boolean>;
}) {
  const { t } = useTranslation();

  return (
    <DialogContent className="rounded-lg border-none bg-transparent p-4 font-nunito md:max-w-[40rem] lg:max-w-[50rem]">
      <div className="flex h-full w-full flex-col gap-4 rounded-lg border border-border bg-background p-6">
        <DialogHeader>
          <DialogTitle>{t("courses.overview.chat-title")}</DialogTitle>
          <DialogDescription className="hidden">
            Join a class by entering
          </DialogDescription>
        </DialogHeader>
        <section>
          <UpdateChatForm
            setIsOpen={setIsOpen}
            postId={postId}
            updateType={type}
          />
        </section>
      </div>
    </DialogContent>
  );
}

export default OptionPopover;
