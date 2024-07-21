import { Button } from "../ui/button";
import { twMerge } from "tailwind-merge";
import { ScrollArea } from "../ui/scroll-area";
import { useSearchedPeople } from "@/services/queries";
import { useParams } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { DebouncedState } from "usehooks-ts";
import { SearchedUserData } from "@/types/user";

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
          "w-full bg-accent dark:bg-accent/40 rounded-md p-2 border border-border",
          props.users.length > 0 && "flex items-center flex-wrap gap-1 p-4"
        )}
      >
        {props.users && (
          <ul className="flex flex-wrap gap-1">
            {props.users.map((user: SearchedUserData) => (
              <li
                key={user.email}
                className="bg-orange-500/20 rounded-full p-1 px-3 pr-8 flex items-center gap-2 relative z-50 w-fit max-w-[300px]"
              >
                <span className="text-orange-500 truncate">{user.email}</span>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-orange-500 w-fit absolute right-0 z-[100] py-0 hover:bg-transparent rounded-full"
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
          className="w-full py-1 px-3 bg-transparent focus:outline-none text-muted-foreground placeholder:text-muted-foreground/40"
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
      <div className="border border-border rounded-md mt-4 w-full flex flex-col items-center justify-center relative h-[10rem]">
        <Loader2Icon className="animate-spin w-8 h-8 mx-auto" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border border-border rounded-md mt-4 w-full flex flex-col items-center justify-center relative h-[10rem]">
        <p>Nothing here.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="border border-border rounded-md mt-4 w-full flex flex-col relative h-[10rem]">
      <ul className="h-full p-4">
        {data.users.map((user) => (
          <li
            key={user.email}
            className="flex items-center gap-4 p-2 hover:bg-muted cursor-pointer rounded-sm transition-all ease-linear duration-200"
            onClick={() => props.handleChangeOptions(user as SearchedUserData)}
          >
            <img
              src={user.avatarUrl}
              alt={user.email}
              className="w-8 h-8 rounded-full"
            />
            <span className="truncate">{user.email}</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

export default CustomSelect;
