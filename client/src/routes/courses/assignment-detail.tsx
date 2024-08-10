import CourseLayout from "@/layouts/course-layout";
import { useAssignment } from "@/services/queries/post";
import { Loader2Icon } from "lucide-react";
import { useParams } from "react-router-dom";
import dateFormat from "@/lib/date-format";
import htmlFromString from "@/lib/sanitize-html";
import OptionPopover from "@/components/courses/chat/option-popover";
import { useCourse } from "@/services/queries/courses";
import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { isDocumentFile, isImageFile, isVideoFile } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  CommentSection,
  CommentTrigger,
} from "@/components/courses/chat/chat-section";

function AssignmentDetailPage() {
  const { postId, id } = useParams<{ postId: string; id: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: course } = useCourse(id!);
  const { data: post, isLoading } = useAssignment(postId!);
  const courseOwner = course?.createdUserEmail;

  if (isLoading)
    return (
      <CourseLayout>
        <Loader2Icon className="animate-spin" />
      </CourseLayout>
    );

  const isUpdated = post?.createdAt === post?.updatedAt;
  const dueDate = dateFormat(new Date(post?.dueDate!));
  const isOverdue = new Date(post?.dueDate!) < new Date(Date.now());

  return (
    <CourseLayout>
      <main className="w-full max-w-[50rem]">
        <section className="flex items-start justify-between">
          <div className="flex w-full max-w-[80%] flex-col gap-2 pl-2 md:p-0">
            <h1 className="truncate text-xl font-bold">{post?.title}</h1>
            <p className="truncate text-sm text-muted-foreground">
              {post?.user?.lastName} {post?.user?.firstName} {" - "}
              {isUpdated && dateFormat(new Date(post?.createdAt!))}
              {!isUpdated &&
                `${dateFormat(new Date(post?.updatedAt!))} (${t("courses.overview.edited")})`}
            </p>
            <p
              className={twMerge(
                "truncate text-sm",
                isOverdue && "text-destructive",
              )}
            >
              {t("courses.assignments.due-date")}
              {": "}
              {dueDate}
            </p>
          </div>
          {(courseOwner === post?.user?.email ||
            user?.email === post?.user?.email) && (
            <OptionPopover
              postId={post?._id!}
              postData={post}
              type="Assignment"
            />
          )}
        </section>
        <Separator className="my-4 mt-6 w-full" />
        <section
          className={twMerge(
            "flex max-w-full flex-col gap-3",
            post?.type === "Post" && "hidden",
          )}
        >
          {post?.text && htmlFromString(post?.text)}
          <span
            className={twMerge(
              "flex flex-wrap gap-2",
              (!post?.files || post?.files?.length <= 0) && "hidden",
            )}
          >
            {post?.files &&
              post?.files.length > 0 &&
              post?.files.map((file) => (
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
        </section>
        <Separator className="my-4 w-full" />
        <section className="flex w-full flex-col gap-2">
          <CommentSection
            courseData={course!}
            postId={post?._id!}
            comments={post?.comments!}
            dateFormat={dateFormat}
            htmlFromString={htmlFromString}
          />
          <CommentTrigger postId={post?._id!} />
        </section>
      </main>
    </CourseLayout>
  );
}

export default AssignmentDetailPage;
