import { usePosts } from "@/services/queries/post";
import { useParams } from "react-router-dom";
import Loading from "@/components/loading";
import { TComment, TPost } from "@/types/post";
import parse, {
  attributesToProps,
  DOMNode,
  domToReact,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";
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
import { Course } from "@/types/course";

function ChatSection({ course }: { course: Course }) {
  const { id } = useParams();
  const { data, isLoading } = usePosts(id!);
  const { user } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <section className="h-[4rem] w-full">
        <Loading />
      </section>
    );
  }

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      const typedDomNode = domNode as Element;

      if (!typedDomNode.attribs) return false;
      if (typedDomNode.attribs.class === "tiptap-paragraph") {
        return (
          <p
            {...attributesToProps(typedDomNode.attribs)}
            className="text-wrap break-words"
          >
            {typedDomNode.children &&
              domToReact(typedDomNode.children as DOMNode[], options)}
          </p>
        );
      }
    },
  };

  const htmlFromString = (text: string) => {
    const clean = DOMPurify.sanitize(text, { ADD_ATTR: ["target"] });
    return parse(clean, options);
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
    <section className="flex w-full flex-col gap-4 xl:gap-6">
      {data?.map((post: TPost) => (
        <div
          key={post._id}
          className="flex min-h-[4rem] w-full flex-col gap-2 rounded-lg border border-border"
        >
          <div className="flex w-full items-center justify-between px-6 pt-4">
            <div className="flex w-full items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={post.user?.avatarUrl}
                  alt={post.user?.email}
                />
                <AvatarFallback>{post.user?.firstName}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                <p className="truncate font-bold">
                  {post.user?.firstName} {post.user?.lastName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {post.createdAt === post.updatedAt &&
                    dateFormat(new Date(post.createdAt!))}
                  {post.createdAt !== post.updatedAt &&
                    `${dateFormat(new Date(post.updatedAt!))} (${t("courses.overview.edited")})`}
                </p>
              </div>
            </div>
            {(user?.email === post.user?.email ||
              course.createdUserEmail === user?.email) && (
              <OptionPopover
                className="translate-x-2"
                isEditabel={user?.email === post.user?.email}
                postId={post._id!}
                postData={post}
              />
            )}
          </div>
          <div className="my-2 flex max-w-full flex-col gap-1 px-6">
            {post.text && htmlFromString(post.text)}
            {post.documents && post.documents.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {post.documents.map((doc) => (
                  <a
                    key={doc.src}
                    href={doc.src}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="h-auto w-fit rounded-lg object-cover"
                  >
                    <p className="truncate text-sm text-blue-500 hover:underline">
                      {doc.name.split("-").pop()}
                    </p>
                  </a>
                ))}
              </div>
            )}
            {post.images && post.images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {post.images.map((img) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.name}
                    className="h-auto w-28 rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
            {post.videos && post.videos.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {post.videos.map((video) => (
                  <video
                    preload="metadata"
                    key={video.src}
                    src={video.src}
                    controls
                    className="h-auto w-48 rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex w-full flex-col gap-2 px-6 pb-4">
            <CommentSection
              courseData={course}
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
  const [showComment, setShowComment] = useState(false);

  return (
    <Dialog open={showComment} onOpenChange={setShowComment}>
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
      <ChatDialog
        setIsCommentOpen={setShowComment}
        type="comment"
        postId={postId}
      />
    </Dialog>
  );
}

function CommentSection({
  courseData,
  postId,
  comments,
  dateFormat,
  htmlFromString,
}: {
  courseData: Course;
  postId: string;
  comments: TComment[];
  dateFormat: (date: Date) => string;
  htmlFromString: (text: string) => string | JSX.Element | JSX.Element[];
}) {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!comments.length) {
    return <section></section>;
  }

  if (comments.length === 1) {
    const comment = comments[0];
    return (
      <section className="my-2 w-full">
        <div className="group flex w-full items-start justify-between">
          <div className="flex w-full max-w-[60%] items-start gap-4 md:max-w-[80%]">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={comment.user?.avatarUrl}
                alt={comment.user?.email}
              />
              <AvatarFallback>{comment.user?.firstName}</AvatarFallback>
            </Avatar>
            <div className="flex w-full flex-col gap-2">
              <p className="text-sm font-bold">
                {comment.user.firstName} {comment.user.lastName}
              </p>
              <div className="flex flex-col gap-1 text-sm leading-4">
                {comment.text && htmlFromString(comment.text)}
              </div>
            </div>
          </div>
          <div className="flex w-full max-w-[40%] items-center justify-end gap-2 md:max-w-[20%]">
            {(user?.email === comment.user.email ||
              courseData.createdUserEmail === user?.email) && (
              <OptionPopover
                postId={postId}
                commentId={comment._id!}
                type="Comment"
                className="invisible group-hover:visible"
              />
            )}
            <p className="text-xs text-muted-foreground">
              {dateFormat(new Date(comment.createdAt!))}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      {comments.length > 1 && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(!showAll)}
          className="my-2 h-fit w-fit !p-0 text-sm text-orange-500 hover:bg-transparent hover:underline"
        >
          {showAll && t("courses.overview.comment-collapse")}
          {!showAll && (
            <p className="w-full self-start truncate">
              {t("courses.overview.comment-expand") +
                " " +
                comments.length +
                " " +
                t("courses.overview.comments")}
            </p>
          )}
        </Button>
      )}
      <div className="my-2 flex w-full flex-col gap-4">
        {showAll &&
          comments.map((comment) => (
            <div
              key={comment._id}
              className="group relative flex w-full items-start justify-between"
            >
              <div className="flex w-full max-w-[60%] items-start gap-4 md:max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={comment.user?.avatarUrl}
                    alt={comment.user?.email}
                  />
                  <AvatarFallback>{comment.user?.firstName}</AvatarFallback>
                </Avatar>
                <div className="flex w-full flex-col gap-2">
                  <p className="text-sm font-bold">
                    {comment.user.firstName} {comment.user.lastName}
                  </p>
                  <div className="flex flex-col gap-1 text-sm leading-4">
                    {comment.text && htmlFromString(comment.text)}
                  </div>
                </div>
              </div>
              <div className="flex w-full max-w-[40%] items-center justify-end gap-2 md:max-w-[20%]">
                {(user?.email === comment.user.email ||
                  courseData.createdUserEmail === user?.email) && (
                  <OptionPopover
                    postId={postId}
                    commentId={comment._id!}
                    type="Comment"
                    className="invisible group-hover:visible"
                  />
                )}
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
              className="group flex w-full items-start justify-between"
            >
              <div className="flex w-full max-w-[60%] items-start gap-4 md:max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={comment.user?.avatarUrl}
                    alt={comment.user?.email}
                  />
                  <AvatarFallback>{comment.user?.firstName}</AvatarFallback>
                </Avatar>
                <div className="flex w-full flex-col gap-2">
                  <p className="text-sm font-bold">
                    {comment.user.firstName} {comment.user.lastName}
                  </p>
                  <div className="flex flex-col gap-1 text-sm leading-4">
                    {comment.text && htmlFromString(comment.text)}
                  </div>
                </div>
              </div>
              <div className="flex w-full max-w-[40%] items-center justify-end gap-2 md:max-w-[20%]">
                {(user?.email === comment.user.email ||
                  courseData.createdUserEmail === user?.email) && (
                  <OptionPopover
                    postId={postId}
                    commentId={comment._id!}
                    type="Comment"
                    className="invisible group-hover:visible"
                  />
                )}
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
