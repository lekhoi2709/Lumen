import { Person } from "@/types/course";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function PeopleList({ people }: { people?: Person[] }) {
  const { t } = useTranslation();

  return (
    <div className="px-2 md:p-0">
      <ul>
        {people &&
          people.map((person) => (
            <li key={person.email}>
              <span className="flex items-center gap-6 md:gap-8">
                <Avatar className="md:w-12 md:h-12">
                  <AvatarImage
                    src={person.avatarUrl}
                    alt={person.name}
                    className="border border-border rounded-full"
                  />
                  <AvatarFallback>{person.email}</AvatarFallback>
                </Avatar>
                <p className="text-sm md:text-base">{person.name}</p>
              </span>
            </li>
          ))}
        {people?.length === 0 && <li>{t("courses.people.no-result")}</li>}
      </ul>
    </div>
  );
}

export default PeopleList;
