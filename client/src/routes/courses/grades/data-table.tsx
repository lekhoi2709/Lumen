import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SubmitAssignmentType, TAssignment } from "@/types/post";
import { useMemo } from "react";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { TFunction } from "i18next";
import { TGradeTable } from "@/types/post";

const generateColumns = (
  assignments: TAssignment[],
  t: TFunction<"translation">,
): ColumnDef<any>[] => {
  const assignmentColumns = assignments.map((assignment, index) => ({
    accessorKey: `assignment_${index}`,
    header: assignment.title,
    cell: (info: any) => {
      const submission = info.row.original.submissions?.[index] as
        | SubmitAssignmentType
        | undefined;

      const value = submission?.grade?.value
        ? submission.grade.value + "/" + submission.grade.max
        : t("courses.assignments.not-graded");

      return value;
    },
  }));

  return [
    {
      accessorKey: "name",
      header: t("courses.people.students"),
      cell: (row) => {
        const firstName = row.row.original.firstName;
        const lastName = row.row.original.lastName;
        const avatarUrl = row.row.original.avatarUrl;
        const email = row.row.original.email;

        return (
          <span className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={avatarUrl} alt={email} />
              <AvatarFallback>{firstName.at(0)?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <p>{`${firstName} ${lastName}`}</p>
          </span>
        );
      },
    },
    ...assignmentColumns,
  ];
};

const prepareData = (gradeTable: TGradeTable) => {
  return gradeTable.students.map((student) => {
    const submissions = gradeTable.assignments.map((assignment) => {
      return assignment.submissions?.find(
        (submission) => submission.user.email === student.email,
      );
    });

    return {
      ...student,
      submissions,
    };
  });
};

function DataTable<TData>({
  gradeTable,
  t,
}: {
  gradeTable: TGradeTable;
  t: TFunction<"translation">;
}) {
  const columns = useMemo(
    () => generateColumns(gradeTable.assignments, t),
    [gradeTable.assignments],
  );
  const data = useMemo(() => prepareData(gradeTable), [gradeTable]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel<TData>(),
  });

  return (
    <div className="w-full max-w-[70rem] overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="w-fit whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
