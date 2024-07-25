import { Course } from "@/types/course";
import { CopyIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { User } from "@/types/user";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ChatDialog from "../chat/chat-dialog";

function CourseOverview({ data }: { data: Course }) {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <section className="w-full md:max-w-[65rem] flex flex-col gap-4 md:gap-6">
      <div className="relative w-full rounded-lg border border-border">
        <img
          src={data.image}
          alt="course-bg"
          className="w-[65rem] h-[10rem] md:h-[15rem] object-cover rounded-lg"
        />
        <Banner title={data.title} description={data.description!} />
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {user?.role === "Teacher" && <CourseCode code={data._id!} t={t} />}
        <div className="flex flex-col gap-4 md:gap-6 w-full">
          <ChatSection user={user} t={t} />
        </div>
      </div>
    </section>
  );
}

function Banner({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-foreground/70 backdrop-blur-sm absolute bottom-0 left-0 w-full p-4 rounded-lg">
      <h1 className="text-xl md:text-2xl font-bold text-background truncate">
        {title}
      </h1>
      <p className="text-background mt-1 truncate">{description}</p>
    </div>
  );
}

function CourseCode({
  code,
  t,
}: {
  code: string;
  t: TFunction<"translation">;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);

    const timeoutId = setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  };
  return (
    <div className="w-full md:w-fit flex items-center justify-between border border-border p-3 px-6 rounded-lg gap-6 md:p-4 md:px-4 md:pl-6">
      <div className="flex flex-col items-start gap-4">
        <h1 className="truncate">{t("courses.overview.course-code")}</h1>
        <p className="text-orange-500">{code}</p>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            asChild
            className="p-3 rounded-full cursor-pointer hover:bg-orange-500/20"
          >
            <span className="relative">
              <CopyIcon
                className="w-6 h-6 md:w-5 md:h-5 text-orange-500"
                onClick={copyCode}
              />
              {isCopied && (
                <span className="p-2 border border-border absolute rounded-md shadow-md bottom-0 -right-[0.4rem] md:-right-3 translate-y-[2.4rem] bg-popover px-3 py-1.5 text-sm text-popover-foreground z-50">
                  <p>Copied</p>
                </span>
              )}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Copy</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function ChatSection({
  user,
  t,
}: {
  user: User | null;
  t: TFunction<"translation">;
}) {
  return (
    <Dialog>
      <DialogTrigger className="border border-border rounded-lg w-full h-[4rem] hover:shadow-md cursor-pointer">
        <div className="w-full h-full flex items-center pl-4 md:pl-6 gap-4 md:gap-6">
          <Avatar>
            {user?.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={user.email} />
            ) : (
              <AvatarFallback>{user?.email}</AvatarFallback>
            )}
          </Avatar>
          <p className="text-sm text-muted-foreground">
            {t("courses.overview.chat-placeholder")}
          </p>
        </div>
      </DialogTrigger>
      <ChatDialog />
    </Dialog>
  );
}

export default CourseOverview;
