import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import ChatForm from "./chat-form";
import CommentForm from "./comment-form";

function ChatDialog({
  type = "announce",
  postId,
}: {
  type?: "announce" | "comment";
  postId?: string;
}) {
  const { t } = useTranslation();
  return (
    <DialogContent className="rounded-lg border-none bg-transparent p-4 font-nunito md:max-w-[40rem] lg:max-w-[50rem]">
      <div className="flex h-full w-full flex-col gap-4 rounded-lg border border-border bg-background p-6">
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
          {type === "announce" && <ChatForm />}
          {type === "comment" && postId && <CommentForm postId={postId} />}
        </section>
      </div>
    </DialogContent>
  );
}

export default ChatDialog;
