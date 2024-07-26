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
          className="flex min-h-[4rem] w-full flex-col gap-2 rounded-lg border border-border p-4 px-6"
        >
          <div className="flex w-full items-center gap-4">
            <img
              src={post.user.avatarUrl}
              alt="user-avatar"
              className="h-8 w-8 rounded-full"
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
          <div className="mt-2 flex flex-col gap-1">
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
          <Separator className="my-1" />
          <div className="flex flex-col gap-2">
            <CommentSection
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
      <DialogTrigger className="mt-1 flex h-8 w-full items-center gap-2">
        <Avatar>
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
  comments,
  dateFormat,
  htmlFromString,
}: {
  comments: TComment[];
  dateFormat: (date: Date) => string;
  htmlFromString: (text: string) => string | JSX.Element | JSX.Element[];
}) {
  const [showAll, setShowAll] = useState(false);

  if (!comments.length) {
    return <section></section>;
  }

  if (comments.length === 1) {
    const comment = comments[0];
    return (
      <section className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar>
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
          <p className="text-xs text-muted-foreground">
            {dateFormat(new Date(comment.createdAt!))}
          </p>
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
          className="h-fit w-fit self-start !p-0 text-sm text-orange-500 hover:bg-transparent hover:underline"
        >
          {showAll ? "Show less" : "Show all"}
        </Button>
      )}
      <div className="my-2 flex flex-col gap-4">
        {showAll &&
          comments.map((comment) => (
            <div key={comment._id} className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar>
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
              <p className="text-xs text-muted-foreground">
                {dateFormat(new Date(comment.createdAt!))}
              </p>
            </div>
          ))}
        {!showAll &&
          comments.slice(0, 1).map((comment) => (
            <div key={comment._id} className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar>
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
              <p className="text-xs text-muted-foreground">
                {dateFormat(new Date(comment.createdAt!))}
              </p>
            </div>
          ))}
      </div>
    </section>
  );
}

export default ChatSection;