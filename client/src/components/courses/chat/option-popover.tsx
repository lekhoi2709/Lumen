import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
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
import { useDeletePost } from "@/services/mutations/posts";

function OptionPopover({
  className,
  postId,
}: {
  className?: string;
  postId: string;
}) {
  const { t } = useTranslation();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className={twMerge("p-2", className)}>
          <EllipsisVerticalIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit max-w-[12rem] p-2 px-4 text-sm">
        <div className="flex flex-col">
          <Button
            variant="ghost"
            className="flex items-center justify-start gap-4 rounded-sm hover:bg-muted"
          >
            <PencilIcon className="h-4 w-4" />
            <span>{t("courses.overview.edit-post")}</span>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-4 rounded-sm hover:bg-muted"
              >
                <TrashIcon className="h-4 w-4 text-destructive" />
                <span>{t("courses.overview.delete-post")}</span>
              </Button>
            </DialogTrigger>
            <DeleteDialog postId={postId} />
          </Dialog>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function DeleteDialog({ postId }: { postId: string }) {
  const { t } = useTranslation();
  const deletePost = useDeletePost();

  const handleDelete = () => {
    deletePost.mutate(postId);
  };

  return (
    <DialogContent className="rounded-lg border-none bg-transparent p-4 font-nunito md:max-w-[30rem] lg:max-w-[40rem]">
      <div className="flex h-full w-full flex-col gap-4 rounded-lg border border-border bg-background p-6">
        <DialogHeader>
          <DialogTitle>{t("courses.overview.delete-post")}</DialogTitle>
          <DialogDescription className="hidden">delete post</DialogDescription>
        </DialogHeader>
        <p>{t("courses.overview.delete-post-confirm")}</p>
        <div className="mt-4 flex gap-4">
          <DialogClose asChild>
            <Button variant="ghost" className="w-full">
              {t("courses.dialog.cancel")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="w-full"
            >
              {t("courses.overview.delete-post")}
            </Button>
          </DialogClose>
        </div>
      </div>
    </DialogContent>
  );
}

export default OptionPopover;
