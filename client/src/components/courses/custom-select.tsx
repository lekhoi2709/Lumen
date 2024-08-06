import { Button } from "../ui/button";
import { twMerge } from "tailwind-merge";
import { ScrollArea } from "../ui/scroll-area";
import { useSearchedPeople } from "@/services/queries/courses";
import { useParams } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { DebouncedState } from "usehooks-ts";
import { SearchedUserData } from "@/types/user";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

type CustomSelectProps = {
  placeholder: string;
  debounced: DebouncedState<Dispatch<SetStateAction<string>>>;
  users: SearchedUserData[];
  setUsers: Dispatch<SetStateAction<SearchedUserData[]>>;
  search: string;
};

function CustomSelect(props: CustomSelectProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const changeOptionsData = (user: SearchedUserData) => {
    setInputValue("");
    props.setUsers((prev) => {
      if (!prev.some((u) => u.email === user.email)) {
        return [...prev, user];
      }
      return prev;
    });
  };

  const handleRemoveUser = (u: SearchedUserData) => {
    props.setUsers((prev) => prev.filter((user) => u.email !== user.email));
  };

  return (
    <section className="h-full">
      <div
        className={twMerge(
          "w-full rounded-md border border-border bg-accent p-2 dark:bg-accent/40",
          props.users.length > 0 && "flex flex-wrap items-center gap-1 p-4",
        )}
      >
        {props.users && (
          <ul className="flex flex-wrap gap-1">
            {props.users.map((user: SearchedUserData) => (
              <li
                key={user.email}
                className="relative z-50 flex w-fit max-w-[300px] items-center gap-2 rounded-full bg-orange-500/20 p-1 px-3 pr-8"
              >
                <span className="truncate text-orange-500">{user.email}</span>
                <Button
                  variant="ghost"
                  className="absolute right-0 z-[100] w-fit rounded-full py-0 text-muted-foreground hover:bg-transparent hover:text-orange-500"
                  onClick={() => handleRemoveUser(user)}
                >
                  &times;
                </Button>
              </li>
            ))}
          </ul>
        )}
        <input
          type="text"
          placeholder={props.placeholder}
          className="w-full bg-transparent px-3 py-1 text-muted-foreground placeholder:text-muted-foreground/40 focus:outline-none"
          onChange={(e) => {
            setInputValue(e.target.value);
            if (e.target.value && e.target.value.length > 3) {
              props.debounced(e.target.value);
            }
          }}
          value={inputValue}
        />
      </div>
      <OptionDisplay
        data={props.search}
        handleChangeOptions={changeOptionsData}
      />
    </section>
  );
}

type OptionDisplayProps = {
  data: string;
  handleChangeOptions: (user: SearchedUserData) => void;
};

function OptionDisplay(props: OptionDisplayProps) {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useSearchedPeople(id!, props.data);

  if (isLoading) {
    return (
      <div className="relative mt-4 flex h-[10rem] w-full flex-col items-center justify-center rounded-md border border-border">
        <Loader2Icon className="mx-auto h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="relative mt-4 flex h-[10rem] w-full flex-col items-center justify-center rounded-md border border-border">
        <p>Nothing here.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="relative mt-4 flex h-[10rem] w-full flex-col rounded-md border border-border">
      <ul className="h-full p-4">
        {data.users.map((user) => (
          <li
            key={user.email}
            className="flex cursor-pointer items-center gap-4 rounded-sm p-2 transition-all duration-200 ease-linear hover:bg-muted"
            onClick={() => props.handleChangeOptions(user as SearchedUserData)}
          >
            <Avatar>
              <AvatarImage
                src={user.avatarUrl}
                alt={user.email}
                className="h-8 w-8 rounded-full border border-border"
              />
              <AvatarFallback>{user.email.at(0)?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="truncate">{user.email}</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

export default CustomSelect;
