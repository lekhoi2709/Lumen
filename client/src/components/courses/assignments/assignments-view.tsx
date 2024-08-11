import { TUnionPost, PostType } from "@/types/post";
import { usePosts } from "@/services/queries/post";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2Icon, NotebookPenIcon } from "lucide-react";
import htmlFromString from "@/lib/sanitize-html";
import { Separator } from "@/components/ui/separator";
import dateFormat from "@/lib/date-format";
import { useTranslation } from "react-i18next";
import OptionPopover from "../chat/option-popover";
import { useAuth } from "@/contexts/auth-context";
import { twMerge } from "tailwind-merge";

function AssignmentView({
  view,
  courseOwner,
}: {
  view: "grid" | "list";
  courseOwner?: string;
}) {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = usePosts(id!);

  if (isLoading) return <Loader2Icon className="animate-spin" />;

  const filteredData = data?.filter(
    (post) => post.type === PostType.Assignment,
  );

  return (
    <main key={view} className="flex w-full flex-col items-center md:mt-6">
      {view === "grid" && (
        <AssignmentGrid courseOwner={courseOwner} data={filteredData!} />
      )}
      {view === "list" && (
        <AssignmentList courseOwner={courseOwner} data={filteredData!} />
      )}
    </main>
  );
}

function AssignmentGrid({
  data,
  courseOwner,
}: {
  data: TUnionPost[];
  courseOwner?: string;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <section className="flex h-full w-full max-w-[65rem] flex-col gap-4 md:grid md:grid-cols-[repeat(auto-fill,18rem)] md:gap-6">
      {data.map((assignment) => {
        if (assignment.type !== PostType.Assignment) return null;

        const dueDate = assignment.dueDate
          ? dateFormat(new Date(assignment.dueDate))
          : t("courses.assignments.no-due-date");
        const isUpdated = assignment.createdAt === assignment.updatedAt;
        const isOverdue = new Date(assignment.dueDate!) < new Date(Date.now());
        const isCourseOwner = courseOwner === user?.email;
        const isPostOwner = user?.email === assignment.user?.email;

        return (
          <div
            key={assignment._id}
            className="group relative rounded-lg border border-border transition-colors duration-300 ease-in-out hover:cursor-pointer hover:border-orange-500 hover:bg-orange-500/10"
          >
            <div className="flex justify-between p-4 pr-2">
              <div
                onClick={() =>
                  navigate(
                    `/courses/${assignment.courseId}/assignments/${assignment._id}`,
                  )
                }
                className="flex w-full max-w-[80%] flex-col gap-1 hover:underline"
              >
                <h2 className="w-full truncate text-xl font-bold">
                  {htmlFromString(assignment.title!)}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {assignment.user?.lastName} {assignment.user?.firstName}
                  {" - "}
                  {isUpdated && dateFormat(new Date(assignment.createdAt!))}
                  {!isUpdated &&
                    `${dateFormat(new Date(assignment.updatedAt!))} (${t("courses.overview.edited")})`}
                </p>
              </div>
              {(isCourseOwner || isPostOwner) && (
                <OptionPopover
                  postId={assignment._id!}
                  postData={assignment}
                  type="Assignment"
                />
              )}
            </div>
            <Separator className="w-full transition-colors duration-300 ease-in-out group-hover:bg-orange-500" />
            <div className="flex flex-col gap-2 p-4">
              <span className="line-clamp-1">
                {htmlFromString(assignment.text!)}
              </span>
              <p
                className={twMerge(
                  "text-sm text-muted-foreground",
                  isOverdue && "text-destructive",
                )}
              >
                {t("courses.assignments.due-date")}
                {": "}
                {dueDate}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function AssignmentList({
  data,
  courseOwner,
}: {
  data: TUnionPost[];
  courseOwner?: string;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <section className="flex h-full w-full max-w-[65rem] flex-col gap-4">
      {data.map((assignment) => {
        if (assignment.type !== PostType.Assignment) return null;
        const dueDate = assignment.dueDate
          ? dateFormat(new Date(assignment.dueDate))
          : t("courses.assignments.no-due-date");
        const isUpdated = assignment.createdAt === assignment.updatedAt;
        const isOverdue = new Date(assignment.dueDate!) < new Date(Date.now());
        const isCourseOwner = courseOwner === user?.email;
        const isPostOwner = user?.email === assignment.user?.email;

        return (
          <div
            key={assignment._id}
            className="group relative flex cursor-pointer flex-col flex-wrap items-start rounded-lg border border-border p-4 pb-4 transition-colors duration-300 ease-in-out hover:border-orange-500 hover:bg-orange-500/10 md:flex-row md:items-center md:justify-between"
          >
            <div
              onClick={() =>
                navigate(
                  `/courses/${assignment.courseId}/assignments/${assignment._id}`,
                )
              }
              className="flex w-full items-center gap-4 md:max-w-[60%]"
            >
              <span className="h-10 w-10 rounded-full border border-orange-500 bg-orange-500/20 p-2">
                <NotebookPenIcon
                  size={22}
                  className="font-thin text-orange-500"
                  strokeWidth={1.5}
                />
              </span>
              <div className="flex w-full max-w-[80%] flex-col gap-1 hover:underline">
                <h2 className="w-full truncate font-bold">
                  {htmlFromString(assignment.title!)}
                </h2>
                <p className="truncate text-sm text-muted-foreground">
                  {assignment.user?.lastName} {assignment.user?.firstName}
                  {" - "}
                  {isUpdated && dateFormat(new Date(assignment.createdAt!))}
                  {!isUpdated &&
                    `${dateFormat(new Date(assignment.updatedAt!))} (${t("courses.overview.edited")})`}
                </p>
              </div>
            </div>
            <div
              className={twMerge(
                "mt-1 flex w-full items-center justify-end gap-2 text-wrap text-right text-sm text-muted-foreground md:m-0 md:max-w-[30%]",
                isOverdue && "text-destructive",
              )}
            >
              <p>
                {t("courses.assignments.due-date")}
                {": "}
                {dueDate}
              </p>
              {(isCourseOwner || isPostOwner) && (
                <OptionPopover
                  postId={assignment._id!}
                  postData={assignment}
                  type="Assignment"
                />
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default AssignmentView;
