import { usePosts } from "@/services/queries/post";
import { useParams } from "react-router-dom";
import Loading from "@/components/loading";
import { TComment, TUnionPost } from "@/types/post";
import htmlFromString from "@/lib/sanitize-html";
import dateFormat from "@/lib/date-format";
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
import { isDocumentFile, isImageFile, isVideoFile } from "@/lib/utils";
import { twMerge } from "tailwind-merge";
import { NotebookPenIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ChatSection({ course }: { course: Course }) {
  const { id } = useParams();
  const { data, isLoading } = usePosts(id!);
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <section className="h-[4rem] w-full">
        <Loading />
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col gap-4 xl:gap-6">
      {data?.map((post: TUnionPost) => (
        <div
          key={post._id}
          className={twMerge(
            "flex min-h-[4rem] w-full flex-col gap-2 rounded-lg border border-border",
            post.type === "Assignment" &&
              "transition-colors duration-300 ease-in-out hover:border-orange-500",
          )}
        >
          <div
            className={twMerge(
              "flex w-full items-center justify-between px-6 pt-4",
              post.type === "Assignment" &&
                "cursor-pointer pb-4 transition-colors duration-300 ease-in-out hover:bg-orange-500/10",
            )}
          >
            {post.type === "Post" && (
              <div className="flex w-full items-center gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={post.user?.avatarUrl}
                    alt={post.user?.email}
                  />
                  <AvatarFallback>{post.user?.firstName.at(0)}</AvatarFallback>
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
            )}
            {post.type === "Assignment" && (
              <div
                className="flex w-full max-w-[80%] items-center gap-4"
                onClick={() =>
                  post.type === "Assignment" &&
                  navigate(`/courses/${id}/assignments/${post._id}`)
                }
              >
                <div className="flex w-full items-center gap-4">
                  <span className="h-10 w-10 rounded-full border border-orange-500 bg-orange-500/20 p-2">
                    <NotebookPenIcon
                      size={22}
                      className="font-thin text-orange-500"
                      strokeWidth={1.5}
                    />
                  </span>
                  <div className="flex flex-col truncate">
                    <p className="truncate">
                      <strong>
                        {post.user?.firstName} {post.user?.lastName}
                      </strong>{" "}
                      {t("courses.assignments.assignment-announce")}{" "}
                      {post.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {post.createdAt === post.updatedAt &&
                        dateFormat(new Date(post.createdAt!))}
                      {post.createdAt !== post.updatedAt &&
                        `${dateFormat(new Date(post.updatedAt!))} (${t("courses.overview.edited")})`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {(user?.email === post.user?.email ||
              course.createdUserEmail === user?.email) && (
              <OptionPopover
                className="translate-x-2"
                isEditabel={user?.email === post.user?.email}
                postId={post._id!}
                type={post.type}
                postData={post}
              />
            )}
          </div>
          <div
            className={twMerge(
              "my-2 flex max-w-full flex-col gap-3 px-6",
              post.type === "Assignment" && "hidden",
            )}
          >
            {post.text && htmlFromString(post.text)}
            <span
              className={twMerge(
                "flex flex-wrap gap-2",
                (!post.files || post.files?.length <= 0) && "hidden",
              )}
            >
              {post.files &&
                post.files.length > 0 &&
                post.files.map((file) => (
                  <div
                    key={file.src}
                    className={twMerge(
                      "w-fit",
                      isDocumentFile(file.name!) &&
                        "order-first h-fit w-full truncate",
                    )}
                  >
                    {isDocumentFile(file.name) && (
                      <a
                        key={file.src}
                        href={file.src}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="h-fit w-full truncate rounded-lg object-cover text-sm text-blue-500 hover:underline"
                      >
                        {file.name.split("-").pop()}
                      </a>
                    )}
                    {isVideoFile(file.name) && (
                      <video
                        preload="metadata"
                        src={file.src}
                        controls
                        className="mt-2 h-auto w-48 grow-0 rounded-lg object-cover"
                      />
                    )}
                    {isImageFile(file.name) && (
                      <img
                        src={file.src}
                        alt={file.name}
                        className="mt-2 h-auto w-28 grow-0 rounded-lg object-cover"
                      />
                    )}
                  </div>
                ))}
            </span>
          </div>
          {post.type !== "Assignment" && (
            <div className="flex w-full flex-col gap-2">
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
          )}
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
      <DialogTrigger className="flex h-8 w-full items-center gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatarUrl} alt={user?.email} />
          <AvatarFallback>{user?.firstName.at(0)}</AvatarFallback>
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
              <AvatarFallback>{comment.user?.firstName.at(0)}</AvatarFallback>
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
                  <AvatarFallback>
                    {comment.user?.firstName.at(0)}
                  </AvatarFallback>
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
                  <AvatarFallback>
                    {comment.user?.firstName.at(0)}
                  </AvatarFallback>
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
export { CommentSection, CommentTrigger };
