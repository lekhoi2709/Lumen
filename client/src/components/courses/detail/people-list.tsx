import { useTranslation } from "react-i18next";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SearchedUserData } from "@/types/user";
import { useMemo } from "react";

function PeopleList({ people }: { people?: SearchedUserData[] }) {
  const { t } = useTranslation();

  const sortedPeople = useMemo(() => {
    return people?.sort((a, b) => {
      if (a.firstName < b.firstName) {
        return -1;
      }
      if (a.firstName > b.firstName) {
        return 1;
      }
      return 0;
    });
  }, [people]);

  return (
    <div className="px-2 md:p-0">
      <ul className="flex flex-col gap-4">
        {sortedPeople &&
          sortedPeople
            .sort((a, b) => {
              if (a.firstName < b.firstName) {
                return -1;
              }
              if (a.firstName > b.firstName) {
                return 1;
              }
              return 0;
            })
            .map((person) => (
              <li key={person.email}>
                <span className="flex items-center gap-4">
                  <Avatar className="w-8 h-8 md:w-10 md:h-10">
                    <AvatarImage
                      src={person.avatarUrl}
                      alt={person.email}
                      className="border border-border rounded-full"
                    />
                    <AvatarFallback>{person.email}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm md:text-base">
                    {person.firstName} {person.lastName}
                  </p>
                </span>
              </li>
            ))}
        {people?.length === 0 && <li>{t("courses.people.no-result")}</li>}
      </ul>
    </div>
  );
}

export default PeopleList;
