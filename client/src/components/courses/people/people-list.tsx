import { useTranslation } from "react-i18next";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SearchedUserData } from "@/types/user";
import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/auth-context";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TFunction } from "i18next";
import { useRemovePeopleFromCourse } from "@/services/mutations/courses";

function PeopleList({
  people,
  isInstructorSection = false,
}: {
  people?: SearchedUserData[];
  isInstructorSection?: boolean;
}) {
  const { t } = useTranslation();
  const [checked, setChecked] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isTeacher =
    user?.courses?.find((course) => course.code === id)?.role === "Teacher";

  const sortedPeople = useMemo(() => {
    const currentUserEmail = user?.email;
    return people?.sort((a, b) => {
      if (a.email === currentUserEmail) {
        return -1;
      }
      if (b.email === currentUserEmail) {
        return 1;
      }
      if (a.firstName < b.firstName) {
        return -1;
      }
      if (a.firstName > b.firstName) {
        return 1;
      }
      return 0;
    });
  }, [people, user]);

  return (
    <div className="px-2 md:p-0">
      {isTeacher && sortedPeople && sortedPeople.length > 1 && (
        <div className="mb-4 flex items-center gap-4 md:mb-5">
          <Checkbox
            checked={
              isInstructorSection
                ? checked.length === sortedPeople.length - 1
                : checked.length === sortedPeople.length
            }
            onCheckedChange={(isChecked) => {
              setChecked(
                isChecked
                  ? sortedPeople
                      .filter((person) => person.email !== user?.email)
                      .map((person) => person.email)
                  : [],
              );
            }}
            className="h-5 w-5 border-orange-500 text-orange-500 transition-all duration-200 ease-in-out hover:bg-orange-500/30 data-[state=checked]:bg-orange-500/20 data-[state=checked]:text-orange-500"
          />
          <RemovePeopleAlertDialog checked={checked} t={t} />
        </div>
      )}
      <ul className="flex flex-col gap-4">
        {sortedPeople &&
          sortedPeople.map((person) => (
            <li key={person.email}>
              <span className="flex items-center gap-4">
                {user?.email !== person.email && isTeacher && (
                  <Checkbox
                    checked={checked.includes(person.email)}
                    onCheckedChange={(isChecked) => {
                      setChecked((prev) =>
                        isChecked
                          ? [...prev, person.email]
                          : prev.filter((email) => email !== person.email),
                      );
                    }}
                    className="h-5 w-5 border-orange-500 text-orange-500 hover:bg-orange-500/30 data-[state=checked]:bg-orange-500/20 data-[state=checked]:text-orange-500"
                  />
                )}
                <Avatar className="h-8 w-8 md:h-10 md:w-10">
                  <AvatarImage
                    src={person.avatarUrl}
                    alt={person.email}
                    className="rounded-full border border-border"
                  />
                  <AvatarFallback>{person.firstName.at(0)}</AvatarFallback>
                </Avatar>
                <p className="text-sm md:text-base">
                  {person.firstName} {person.lastName}
                </p>
              </span>
            </li>
          ))}
        {people?.length === 0 && !isInstructorSection && (
          <li>{t("courses.people.no-result")}</li>
        )}
      </ul>
    </div>
  );
}

function RemovePeopleAlertDialog({
  checked,
  t,
}: {
  checked: string[];
  t: TFunction<"translation">;
}) {
  const { id } = useParams<{ id: string }>();
  const payload = {
    id: id!,
    emails: checked,
  };
  const removePeopleMutation = useRemovePeopleFromCourse();
  const onRemovePeople = () => {
    removePeopleMutation.mutate(payload);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          disabled={checked.length <= 0}
          className="h-fit w-24 border-destructive !py-2 text-destructive hover:bg-destructive/40 hover:text-foreground dark:border-red-700 dark:text-red-800 dark:hover:text-foreground dark:disabled:opacity-70"
        >
          {t("courses.people.remove-btn")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("courses.people.remove-confirm")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("courses.people.remove-description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex w-full items-center justify-center">
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {checked.map((email) => (
              <li key={email}>{email}</li>
            ))}
          </ul>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("courses.people.remove-cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onRemovePeople}>
            {t("courses.people.remove-btn")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PeopleList;
