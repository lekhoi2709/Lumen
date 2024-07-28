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
import ChatSection from "../chat/chat-section";
import { twMerge } from "tailwind-merge";

function CourseOverview({ data }: { data: Course }) {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <section className="flex w-full flex-col gap-4 md:max-w-[65rem] xl:gap-6">
      <div className="relative w-full rounded-lg border border-border">
        <img
          src={data.image}
          alt="course-bg"
          className="h-[10rem] w-[65rem] rounded-lg object-cover md:h-[15rem]"
        />
        <Banner title={data.title} description={data.description!} />
      </div>
      <div className="relative flex w-full flex-col gap-4 xl:flex-row xl:gap-6">
        {user?.role === "Teacher" && <CourseCode code={data._id!} t={t} />}
        <div className="flex w-full flex-col gap-4 xl:max-w-[calc(80%-1.5rem)] xl:gap-6">
          <ChatTrigger user={user} t={t} />
          <ChatSection />
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
    <div className="absolute bottom-0 left-0 w-full rounded-lg bg-foreground/70 p-4 backdrop-blur-sm">
      <h1 className="truncate text-xl font-bold text-background md:text-2xl">
        {title}
      </h1>
      <p className="mt-1 truncate text-background">{description}</p>
    </div>
  );
}

function CourseCode({
  code,
  t,
  className,
}: {
  code: string;
  t: TFunction<"translation">;
  className?: string;
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
    <div
      className={twMerge(
        "z-0 flex max-h-[8rem] w-full items-center justify-between gap-6 rounded-lg border border-border p-3 px-6 pr-4 xl:max-w-[20%]",
        className,
      )}
    >
      <div className="flex flex-col items-start gap-4">
        <h1 className="truncate">{t("courses.overview.course-code")}</h1>
        <p className="text-orange-500">{code}</p>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            asChild
            className="cursor-pointer rounded-full p-3 hover:bg-orange-500/20"
          >
            <span className="relative">
              <CopyIcon
                className="h-6 w-6 text-orange-500 md:h-5 md:w-5"
                onClick={copyCode}
              />
              {isCopied && (
                <span className="z-100 absolute -top-[2rem] right-[3.5rem] translate-y-[2.4rem] rounded-md border border-border bg-popover p-2 px-3 py-1.5 text-sm text-popover-foreground shadow-md md:-right-3 md:bottom-0 md:top-auto">
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

function ChatTrigger({
  user,
  t,
}: {
  user: User | null;
  t: TFunction<"translation">;
}) {
  return (
    <Dialog>
      <DialogTrigger className="h-[4rem] w-full cursor-pointer truncate rounded-lg border border-border transition-shadow duration-300 ease-in-out hover:shadow-md dark:shadow-white/20">
        <div className="flex h-full w-full items-center gap-4 pl-4 md:gap-6 md:pl-6">
          <Avatar>
            <AvatarImage src={user?.avatarUrl} alt={user?.email} />
            <AvatarFallback>{user?.email}</AvatarFallback>
          </Avatar>
          <p className="truncate text-sm text-muted-foreground">
            {t("courses.overview.chat-placeholder")}
          </p>
        </div>
      </DialogTrigger>
      <ChatDialog />
    </Dialog>
  );
}

export default CourseOverview;
export { CourseCode };
