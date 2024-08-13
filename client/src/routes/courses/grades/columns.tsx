import { TAssignment } from "@/types/post";
import { SearchedUserData } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type TGradeTable = {
  students: SearchedUserData[];
  assignments: TAssignment[];
};

const studentColumns: ColumnDef<SearchedUserData>[] = [
  {
    accessorKey: "fullName",
    id: "students",
    header: "Students",
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
];

export { studentColumns };
