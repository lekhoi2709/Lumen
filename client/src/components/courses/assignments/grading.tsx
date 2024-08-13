import { SubmitAssignmentType } from "@/types/post";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import dateFormat from "@/lib/date-format";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Loader2Icon } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGradingSubmission } from "@/services/mutations/posts";
import { SearchedUserData } from "@/types/user";

function GradingSection({
  submissions,
  dueDate,
}: {
  submissions?: SubmitAssignmentType[];
  dueDate?: string;
}) {
  const { t } = useTranslation();
  const { id, postId } = useParams<{ id: string; postId: string }>();
  const { user } = useAuth();
  const isOverdue = (date: string) => {
    return new Date(dueDate!) < new Date(date);
  };
  const [maxGrade, setMaxGrade] = useState<number>(100);
  const [grade, setGrade] = useState<number>(100);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGraded, setIsGraded] = useState<boolean[]>(
    submissions?.map((submission) => submission.grade !== undefined) || [],
  );
  const gradingMutation = useGradingSubmission();

  const handleGradeChange = (index: number, value: boolean) => {
    const updatedGrades = [...isGraded];
    updatedGrades[index] = value;
    setIsGraded(updatedGrades);
  };

  const handleGradings = (studentEmail: string) => {
    try {
      setIsSubmitting(true);
      gradingMutation.mutate({
        courseId: id!,
        postId: postId!,
        gradedBy: user as SearchedUserData,
        grade: grade,
        maxGrade: maxGrade,
        comment: comment,
        studentEmail: studentEmail,
      });
      setIsSubmitting(false);
      setIsGraded(isGraded.map(() => true));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.response.data.message,
      });
    }
  };

  return (
    <section>
      <span className="flex items-center gap-4">
        <h1 className="text-xl">{t("courses.assignments.grading")}</h1>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted-foreground pt-[1px] text-sm text-background">
          {submissions?.length}
        </span>
      </span>
      <div className="mt-4 flex flex-col gap-4">
        {submissions?.map((submission, index) => {
          return (
            <div
              key={submission._id}
              className="flex flex-col gap-4 rounded-md border p-4"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={submission.user.avatarUrl} />
                    <AvatarFallback>
                      {submission.user.firstName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p>
                    {submission.user.firstName} {submission.user.lastName}
                  </p>
                </span>
                <p className="text-sm text-muted-foreground">
                  {isOverdue(submission.createdAt!)
                    ? t("courses.assignments.late")
                    : dateFormat(new Date(submission.createdAt!))}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h3>{t("courses.assignments.submissions")}</h3>
                <div className="flex flex-col gap-1">
                  {submission.files.map((file) => (
                    <a
                      key={file.src}
                      href={file.src}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="w-fit truncate rounded-lg object-cover text-sm text-blue-500 hover:underline"
                    >
                      {file.name.split("-").pop()}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex w-full flex-wrap justify-end gap-2 md:flex-nowrap">
                <div className="flex w-full items-center gap-4">
                  <Input
                    disabled={isGraded[index]}
                    id="teacher_comment"
                    className="w-full flex-1"
                    placeholder={t("courses.assignments.comment")}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Input
                    id="teacher_grade"
                    disabled={isGraded[index]}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min={0}
                    max={maxGrade}
                    value={isGraded[index] ? submission.grade?.value : grade}
                    onChange={(e) =>
                      setGrade(
                        !Number.isNaN(parseInt(e.target.value))
                          ? parseInt(e.target.value)
                          : 0,
                      )
                    }
                    className="w-full max-w-16 md:max-w-24"
                  />
                  <span className="text-xl">/</span>
                  <Input
                    disabled={isGraded[index]}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) =>
                      setMaxGrade(
                        !Number.isNaN(parseInt(e.target.value))
                          ? parseInt(e.target.value)
                          : 0,
                      )
                    }
                    value={isGraded[index] ? submission.grade?.max : maxGrade}
                    className="w-full max-w-16 md:max-w-24"
                  />
                </div>
                <Button onClick={() => handleGradeChange(index, false)}>
                  Edit
                </Button>
                <Button onClick={() => handleGradings(submission.user.email)}>
                  {isSubmitting && <Loader2Icon className="animate-spin" />}
                  {!isSubmitting && "Submit"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default GradingSection;
