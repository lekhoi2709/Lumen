import { TAssignment } from "@/types/post";
import { ColumnDef, SortingFn } from "@tanstack/react-table";
import { TFunction } from "i18next";
import dateFormat from "@/lib/date-format";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NavigateFunction } from "react-router-dom";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const generateColumns = (
  t: TFunction<"translation">,
  studentEmail: string,
  navigate: NavigateFunction,
  courseId: string,
) => {
  const columns: ColumnDef<TAssignment, any>[] = [
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(
                column.getIsSorted() === "asc" ? true : false,
              )
            }
          >
            {t("courses.assignments.title")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        return (
          <Button
            variant={"ghost"}
            className="text-left hover:underline"
            onClick={() =>
              navigate(
                `/courses/${courseId}/assignments/${info.row.original._id}`,
              )
            }
          >
            {info.row.original.title}
          </Button>
        );
      },
    },
    {
      id: "submissions.createdAt",
      header: t("courses.assignments.submit-date"),
      cell: (info) => {
        const submission = info.row.original.submissions?.find(
          (submission) => submission.user.email === studentEmail,
        );
        return submission
          ? dateFormat(new Date(submission.createdAt!))
          : t("courses.assignments.not-submitted");
      },
    },
    {
      id: "dueDate",
      accessorKey: "dueDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(
                column.getIsSorted() === "asc" ? true : false,
              )
            }
          >
            {t("courses.assignments.due-date")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (info) => {
        const dueDate = dateFormat(new Date(info.row.original.dueDate!));
        return dueDate !== "NaN-NaN-NaN"
          ? dueDate
          : t("courses.assignments.no-due-date");
      },
      sortingFn: dateSorting,
    },
    {
      id: "submissions.grade",
      header: t("courses.assignments.grade"),
      cell: (info) => {
        const grade = info.row.original.submissions?.find(
          (submission) => submission.user.email === studentEmail,
        )?.grade;
        return grade && grade.value
          ? grade.value + "/" + grade.max
          : t("courses.assignments.not-graded");
      },
    },
    {
      id: "submissions.comment",
      header: t("courses.assignments.comment"),
      cell: (info) =>
        info.row.original.submissions?.find(
          (submission) => submission.user.email === studentEmail,
        )?.grade?.comment ?? t("courses.assignments.no-comment"),
    },
    {
      id: "submissions.grade.by",
      header: t("courses.assignments.graded-by"),
      cell: (info) => {
        const gradedByInfo = info.row.original.submissions?.find(
          (submission) => submission.user.email === studentEmail,
        )?.grade?.by;

        if (gradedByInfo) {
          return (
            <span className="flex items-center gap-4">
              <Avatar className="border">
                <AvatarImage src={gradedByInfo.avatarUrl} alt="avatar" />
                <AvatarFallback>
                  {gradedByInfo.firstName.at(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p>
                {gradedByInfo.firstName} {gradedByInfo.lastName}
              </p>
            </span>
          );
        }
        return "N/A";
      },
    },
  ];

  return columns;
};

const dateSorting: SortingFn<any> = (rowA, rowB, columnId) => {
  const dateA = new Date(rowA.getValue<string>(columnId) ?? 0);
  const dateB = new Date(rowB.getValue<string>(columnId) ?? 0);
  return dateA.getTime() - dateB.getTime();
};

export default generateColumns;
