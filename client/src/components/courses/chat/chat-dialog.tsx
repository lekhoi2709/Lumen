import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import ChatForm from "./chat-form";
import CommentForm from "./comment-form";
import { Dispatch } from "react";

function ChatDialog({
  setIsOpen,
  setIsCommentOpen,
  type = "announce",
  commentType = "Post",
  postId,
}: {
  setIsOpen?: Dispatch<boolean>;
  setIsCommentOpen?: Dispatch<boolean>;
  type?: "announce" | "comment";
  commentType?: "Post" | "Assignment";
  postId?: string;
}) {
  const { t } = useTranslation();
  return (
    <DialogContent className="rounded-lg border-none bg-transparent p-4 font-nunito lg:max-w-[50rem]">
      <div className="flex h-full w-full max-w-[calc(100vw-2rem)] flex-col gap-4 rounded-lg border border-border bg-background p-6">
        <DialogHeader>
          <DialogTitle>
            {type === "announce" && t("courses.overview.chat-title")}
            {type === "comment" && t("courses.overview.comment-title")}
          </DialogTitle>
          <DialogDescription className="hidden">
            Join a class by entering
          </DialogDescription>
        </DialogHeader>
        <section>
          {type === "announce" && <ChatForm setIsOpen={setIsOpen!} />}
          {type === "comment" && postId && (
            <CommentForm
              setIsCommentOpen={setIsCommentOpen!}
              postId={postId}
              type={commentType}
            />
          )}
        </section>
      </div>
    </DialogContent>
  );
}

export default ChatDialog;
