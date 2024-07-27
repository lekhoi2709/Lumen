import { usePosts } from "@/services/queries/post";
import { useParams } from "react-router-dom";
import Loading from "@/components/loading";
import { TComment, TPost } from "@/types/post";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ChatDialog from "./chat-dialog";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import OptionPopover from "./option-popover";

function ChatSection() {
  const { id } = useParams();
  const { data, isLoading } = usePosts(id!);

  if (isLoading) {
    return (
      <section className="h-[4rem] w-full">
        <Loading />
      </section>
    );
  }

  const htmlFromString = (text: string) => {
    const clean = DOMPurify.sanitize(text);
    return parse(clean);
  };

  const dateFormat = (date: Date) => {
    const now = new Date();
    const isCurrentYear = date.getFullYear() === now.getFullYear();
    const isCurrentDate = date.toDateString() === now.toDateString();

    if (isCurrentDate) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } else if (isCurrentYear) {
      const currentMonth = (date.getMonth() + 1).toString().padStart(2, "0");
      const currentDate = date.getDate().toString().padStart(2, "0");
      return `${currentDate}-${currentMonth}`;
    } else {
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${day}-${month}-${year}`;
    }
  };

  return (
    <section className="flex w-full flex-col gap-4 md:gap-6">
      {data?.map((post: TPost) => (
        <div
          key={post._id}
          className="flex min-h-[4rem] w-full flex-col gap-2 rounded-lg border border-border"
        >
          <div className="flex w-full items-center justify-between px-6 pt-4">
            <div className="flex w-full items-center gap-4">
              <img
                src={post.user.avatarUrl}
                alt="user-avatar"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col truncate">
                <p className="truncate font-bold">
                  {post.user.firstName} {post.user.lastName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {dateFormat(new Date(post.createdAt!))}
                </p>
              </div>
            </div>
            <OptionPopover className="translate-x-2" postId={post._id!} />
          </div>
          <div className="mt-2 flex flex-col gap-1 px-6">
            {post.text && htmlFromString(post.text)}
            {post.images && (
              <div className="flex gap-2">
                {post.images.map((img) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
            {post.videos && (
              <div className="flex gap-2">
                {post.videos.map((video) => (
                  <video
                    key={video.src}
                    src={video.src}
                    controls
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex flex-col gap-2 px-6 pb-4">
            <CommentSection
              postId={post._id!}
              comments={post.comments!}
              dateFormat={dateFormat}
              htmlFromString={htmlFromString}
            />
            <CommentTrigger postId={post._id!} />
          </div>
        </div>
      ))}
    </section>
  );
}

function CommentTrigger({ postId }: { postId: string }) {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger className="mt-1 flex h-8 w-full items-center gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatarUrl} alt={user?.email} />
          <AvatarFallback>{user?.firstName}</AvatarFallback>
        </Avatar>
        <div className="h-fit w-full cursor-pointer truncate rounded-lg border border-border p-2 px-4 text-left md:px-6">
          <p className="truncate text-sm text-muted-foreground">
            {t("courses.overview.comment-placeholder")}
          </p>
        </div>
      </DialogTrigger>
      <ChatDialog type="comment" postId={postId} />
    </Dialog>
  );
}

function CommentSection({
  postId,
  comments,
  dateFormat,
  htmlFromString,
}: {
  postId: string;
  comments: TComment[];
  dateFormat: (date: Date) => string;
  htmlFromString: (text: string) => string | JSX.Element | JSX.Element[];
}) {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();

  if (!comments.length) {
    return <section></section>;
  }

  if (comments.length === 1) {
    const comment = comments[0];
    return (
      <section className="my-2 flex flex-col">
        <div className="group flex items-start justify-between hover:cursor-pointer">
          <div className="flex items-start gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={comment.user?.avatarUrl}
                alt={comment.user?.email}
              />
              <AvatarFallback>{comment.user?.firstName}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold">
                {comment.user.firstName} {comment.user.lastName}
              </p>
              <div className="flex flex-col gap-1 text-sm leading-4">
                {comment.text && htmlFromString(comment.text)}
              </div>
            </div>
          </div>
          <div className="relative flex items-center gap-2">
            <OptionPopover
              postId={postId}
              commentId={comment._id!}
              type="Comment"
              className="invisible group-hover:visible"
            />
            <p className="text-xs text-muted-foreground">
              {dateFormat(new Date(comment.createdAt!))}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      {comments.length > 1 && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(!showAll)}
          className="my-2 h-fit w-fit self-start !p-0 text-sm text-orange-500 hover:bg-transparent hover:underline"
        >
          {showAll && t("courses.overview.comment-collapse")}
          {!showAll &&
            t("courses.overview.comment-expand") +
              " " +
              comments.length +
              " " +
              t("courses.overview.comments")}
        </Button>
      )}
      <div className="my-2 flex flex-col gap-4">
        {showAll &&
          comments.map((comment) => (
            <div
              key={comment._id}
              className="group flex items-start justify-between hover:cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={comment.user?.avatarUrl}
                    alt={comment.user?.email}
                  />
                  <AvatarFallback>{comment.user?.firstName}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold">
                    {comment.user.firstName} {comment.user.lastName}
                  </p>
                  <div className="flex flex-col gap-1 text-sm leading-4">
                    {comment.text && htmlFromString(comment.text)}
                  </div>
                </div>
              </div>
              <div className="relative flex items-center gap-2">
                <OptionPopover
                  postId={postId}
                  commentId={comment._id!}
                  type="Comment"
                  className="invisible group-hover:visible"
                />
                <p className="text-xs text-muted-foreground">
                  {dateFormat(new Date(comment.createdAt!))}
                </p>
              </div>
            </div>
          ))}
        {!showAll &&
          comments.slice(0, 1).map((comment) => (
            <div
              key={comment._id}
              className="group flex items-start justify-between hover:cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={comment.user?.avatarUrl}
                    alt={comment.user?.email}
                  />
                  <AvatarFallback>{comment.user?.firstName}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold">
                    {comment.user.firstName} {comment.user.lastName}
                  </p>
                  <div className="flex flex-col gap-1 text-sm leading-4">
                    {comment.text && htmlFromString(comment.text)}
                  </div>
                </div>
              </div>
              <div className="relative flex items-center gap-2">
                <OptionPopover
                  postId={postId}
                  commentId={comment._id!}
                  type="Comment"
                  className="invisible group-hover:visible"
                />
                <p className="text-xs text-muted-foreground">
                  {dateFormat(new Date(comment.createdAt!))}
                </p>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

export default ChatSection;
