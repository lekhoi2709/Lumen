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
import UploadButton from "@/components/upload";
import { useState } from "react";
import { FilesList } from "@/components/courses/chat/chatform-layout";
import { Button } from "@/components/ui/button";
import { PostType, SubmitAssignmentType, TUnionPost } from "@/types/post";
import {
  useSubmitAssignment,
  useUnsubmitAssignment,
} from "@/services/mutations/posts";
import { SearchedUserData } from "@/types/user";
import { toast } from "@/components/ui/use-toast";
import { deleteFiles, uploadFiles } from "@/services/api/posts-api";
import GradingSection from "@/components/courses/assignments/grading";

function AssignmentDetailPage() {
  const { postId, id } = useParams<{ postId: string; id: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: course } = useCourse(id!);
  const { data: assignment, isLoading } = useAssignment(postId!);
  const courseOwner = course?.createdUserEmail;
  const isCourseOwner = courseOwner === user?.email;
  const isPostOwner = user?.email === assignment?.user?.email;
  const isTeacher =
    user?.courses?.find((course) => course.code === id)?.role === "Teacher";
  const isStudent =
    user?.courses?.find((course) => course.code === id)?.role === "Student";

  if (isLoading)
    return (
      <CourseLayout>
        <Loader2Icon className="animate-spin" />
      </CourseLayout>
    );

  if (assignment?.type !== PostType.Assignment)
    return <CourseLayout>404</CourseLayout>;
  const isUpdated = assignment?.createdAt === assignment?.updatedAt;
  const dueDate = assignment.dueDate
    ? dateFormat(new Date(assignment.dueDate))
    : t("courses.assignments.no-due-date");
  const isOverdue = new Date(assignment?.dueDate!) < new Date(Date.now());

  return (
    <CourseLayout>
      <main className="flex w-full max-w-[60rem] flex-col gap-6 px-2 md:flex-row md:p-0">
        <section className="w-full">
          <section className="flex items-start justify-between">
            <div className="flex w-full max-w-[80%] flex-col gap-2 pl-2 md:p-0">
              <h1 className="truncate text-xl font-bold">
                {assignment?.title}
              </h1>
              <p className="truncate text-sm text-muted-foreground">
                {assignment?.user?.lastName} {assignment?.user?.firstName}{" "}
                {" - "}
                {isUpdated && dateFormat(new Date(assignment?.createdAt!))}
                {!isUpdated &&
                  `${dateFormat(new Date(assignment?.updatedAt!))} (${t("courses.overview.edited")})`}
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
            {(isCourseOwner || isPostOwner) && (
              <OptionPopover
                postId={assignment?._id!}
                postData={assignment}
                type="Assignment"
              />
            )}
          </section>
          <Separator className="my-4 mt-6 w-full" />
          <section className="flex max-w-full flex-col gap-3">
            {assignment?.text && htmlFromString(assignment?.text)}
            <span
              className={twMerge(
                "flex flex-wrap gap-2",
                (!assignment?.files || assignment?.files?.length <= 0) &&
                  "hidden",
              )}
            >
              {assignment?.files &&
                assignment?.files.length > 0 &&
                assignment?.files.map((file) => (
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
              postId={assignment?._id!}
              comments={assignment?.comments!}
              dateFormat={dateFormat}
              htmlFromString={htmlFromString}
            />
            <CommentTrigger postId={assignment?._id!} type="Assignment" />
          </section>
          <Separator className="my-4 mt-6 w-full" />
          {isTeacher && (
            <GradingSection
              submissions={assignment.submissions}
              dueDate={assignment.dueDate as string}
            />
          )}
        </section>
        {isStudent && <SubmissionSection assignmentData={assignment} />}
      </main>
    </CourseLayout>
  );
}

function SubmissionSection({ assignmentData }: { assignmentData: TUnionPost }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { postId, id } = useParams<{ postId: string; id: string }>();
  const [files, setFiles] = useState<File[]>([]);
  const submitAssignmentMutation = useSubmitAssignment();
  const unSubmitAssignmentMutation = useUnsubmitAssignment();
  const isEmptyFiles = files.length <= 0;
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (assignmentData.type !== PostType.Assignment) return null;
  const isSubmitted = assignmentData.submissions?.find(
    (submission) => submission.user.email === user?.email,
  );

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (isEmptyFiles) return;
      const response = await uploadFiles({ courseId: id!, files });
      if (response.urls && response.urls.length > 0) {
        const payload: SubmitAssignmentType = {
          user: user as SearchedUserData,
          files: [],
        };

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

        payload.files.push(...images, ...videos, ...documents);

        await submitAssignmentMutation.mutateAsync({
          postId: postId!,
          postData: payload,
        });
      }
      setFiles([]);
      setIsSubmitting(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response.data.message || error.message,
      });
    }
  };

  const getModifiedFileNames = (post: SubmitAssignmentType) => {
    const fileNames = post.files?.map((file) => id + "/" + file.name);
    return fileNames;
  };

  const handleUnsubmit = async () => {
    try {
      if (!isSubmitted) return;
      setIsSubmitting(true);
      const fileNames = getModifiedFileNames(isSubmitted);
      await deleteFiles(fileNames!, id!);
      await unSubmitAssignmentMutation.mutateAsync({
        postId: postId!,
        submissionId: isSubmitted._id!,
      });
      setIsSubmitting(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response.data.message || error.message,
      });
    }
  };

  const isOverdue = (date: string, dueDate: string | Date) => {
    return new Date(dueDate) < new Date(date);
  };

  return (
    <section className="h-fit w-full rounded-md border border-border p-4 md:max-w-[30%]">
      <section className="flex h-full w-full flex-col justify-between gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {t("courses.assignments.submission")}
          </h2>
          <p className="font-nunito text-sm">
            {isOverdue(isSubmitted?.createdAt!, assignmentData.dueDate!) &&
              t("courses.assignments.late")}
          </p>
        </div>

        {isSubmitted && isSubmitted?.grade?.value && (
          <p className="font-nunito text-sm">
            {isSubmitted.grade.value + " / " + isSubmitted.grade.max}
          </p>
        )}
        <div className="flex w-full flex-wrap justify-center gap-4">
          {isSubmitted &&
            isSubmitted.files.map((file) => (
              <a
                key={file.src}
                href={file.src}
                target="_blank"
                rel="noreferrer noopener"
                className="w-full truncate rounded-lg object-cover text-sm text-blue-500 hover:underline"
              >
                {file.name.split("-").pop()}
              </a>
            ))}
          <FilesList
            files={files}
            setFiles={setFiles}
            className="min-w-[7rem] max-w-[10rem] p-0 md:max-w-full"
          />
        </div>
        <div className="flex w-full flex-col gap-4">
          <UploadButton
            files={files}
            setFiles={setFiles}
            className={twMerge("w-full", isSubmitted && "hidden")}
          />
          {!isSubmitted && (
            <Button onClick={handleSubmit} disabled={isEmptyFiles}>
              {!isSubmitting && t("courses.assignments.submit")}
              {isSubmitting && <Loader2Icon className="animate-spin" />}
            </Button>
          )}
          {isSubmitted && (
            <Button
              variant="outline"
              onClick={handleUnsubmit}
              className="text-orange-500"
            >
              {!isSubmitting && t("courses.assignments.unsubmit")}
              {isSubmitting && <Loader2Icon className="animate-spin" />}
            </Button>
          )}
        </div>
      </section>
    </section>
  );
}

export default AssignmentDetailPage;
