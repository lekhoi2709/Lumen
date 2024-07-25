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
import { useJoinCourse } from "@/services/mutations/courses";
import { toast } from "../ui/use-toast";

function JoinCourse({ user }: { user: User | null }) {
  const { t } = useTranslation();
  const joinCourseMutation = useJoinCourse();

  const handleSubmit = () => {
    const id = document.querySelector("input")?.value;
    if (id === "" || !id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a code",
      });
      return;
    }

    joinCourseMutation.mutate({ email: user!.email, courseId: id });
  };

  return (
    <DialogContent className="rounded-lg border-none bg-transparent p-4 font-nunito">
      <div className="flex h-full w-full flex-col gap-6 rounded-lg border border-border bg-background p-6">
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
          <div className="flex flex-col gap-4 rounded-md border border-border p-4 py-6">
            <p className="text-sm text-muted-foreground">
              {t("courses.dialog.description")}
            </p>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={user!.avatarUrl} alt="User avatar" />
                <AvatarFallback>{user!.firstName.split("")[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {user!.firstName} {user!.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user!.email}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-md border border-border p-4 py-6">
            <div>
              <h1>{t("courses.dialog.code")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("courses.dialog.code-des")}
              </p>
            </div>
            <Input placeholder={t("courses.dialog.code")} className="py-6" />
          </div>
          <div className="flex w-full justify-end gap-2 md:flex-row">
            <DialogClose asChild>
              <Button variant="outline" className="hidden md:block">
                {t("courses.dialog.cancel")}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="button"
                onClick={handleSubmit}
                className="w-full md:w-fit"
              >
                {t("courses.dialog.join-btn")}
              </Button>
            </DialogClose>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}

export default JoinCourse;
