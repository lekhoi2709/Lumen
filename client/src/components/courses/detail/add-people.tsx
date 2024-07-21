import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { UserPlusIcon } from "lucide-react";
import { TFunction } from "i18next";
import { useDebounceCallback } from "usehooks-ts";
import { useState } from "react";
import { SearchedUserData } from "@/types/user";
import CustomSelect from "../custom-select";

function AddPeopleDialog({ type }: { type: "ins" | "stu" }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<SearchedUserData[]>([]);

  const debounced = useDebounceCallback(setSearch, 1000);

  console.log(users);

  return (
    <Dialog
      onOpenChange={(value) => {
        if (!value) {
          setUsers([]);
          setSearch("");
        }
      }}
    >
      <IconTrigger type={type} t={t} />
      <DialogContent className="max-w-[400px] rounded-lg font-nunito">
        <DialogHeader>
          <DialogTitle>
            {type === "ins" && t("courses.people.add-instructor")}
            {type === "stu" && t("courses.people.add-student")}
          </DialogTitle>
          <DialogDescription className="hidden">
            Join a class by entering
          </DialogDescription>
        </DialogHeader>
        <section className="rounded-md border border-border p-4 py-6 flex flex-col gap-4">
          <CustomSelect
            placeholder={t("courses.people.invite-input")}
            debounced={debounced}
            users={users}
            setUsers={setUsers}
            search={search}
          />
        </section>
        <div className="flex w-full md:flex-row gap-2 justify-end">
          <DialogClose asChild>
            <Button variant="outline" className="hidden md:block">
              {t("courses.dialog.cancel")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" className="w-full md:w-fit">
              {t("courses.people.invite-btn")}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function IconTrigger({
  type,
  t,
}: {
  type: "ins" | "stu";
  t: TFunction<"translation">;
}) {
  return (
    <DialogTrigger className="p-3 rounded-full pointer hover:bg-muted">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild className="">
            <span>
              <UserPlusIcon size={24} />
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={16}>
            {type === "ins" && t("courses.people.add-instructor")}
            {type === "stu" && t("courses.people.add-student")}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </DialogTrigger>
  );
}

export default AddPeopleDialog;
