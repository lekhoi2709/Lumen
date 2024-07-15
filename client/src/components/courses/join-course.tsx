import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTranslation } from "react-i18next";
import { User } from "@/types/user";

function JoinCourse({ user }: { user: User | null }) {
  const { t } = useTranslation();

  return (
    <DialogContent className="max-w-[400px] rounded-lg font-nunito">
      <DialogHeader>
        <DialogTitle>{t("courses.dialog.join")}</DialogTitle>
        <DialogDescription className="hidden">
          Join a class by entering
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={() => {
          console.log("hello");
        }}
        className="flex flex-col gap-4"
      >
        <div className="rounded-md border border-border p-4 py-6 flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            {t("courses.dialog.description")}
          </p>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user!.avatarUrl} alt="User avatar" />
              <AvatarFallback>{user!.firstName.split("")[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-foreground text-sm">
                {user!.firstName} {user!.lastName}
              </p>
              <p className="text-muted-foreground text-xs">{user!.email}</p>
            </div>
          </div>
        </div>
        <div className="rounded-md border border-border p-4 py-6 flex flex-col gap-4">
          <div>
            <h1>{t("courses.dialog.code")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("courses.dialog.code-des")}
            </p>
          </div>
          <Input placeholder={t("courses.dialog.code")} className="py-6" />
        </div>
        <div className="flex w-full md:flex-row gap-2 justify-end">
          <DialogClose asChild>
            <Button variant="outline" className="hidden md:block">
              {t("courses.dialog.cancel")}
            </Button>
          </DialogClose>
          <Button type="submit" className="w-full md:w-fit">
            {t("courses.dialog.join-btn")}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

export default JoinCourse;
