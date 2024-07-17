import { Course } from "@/types/course";
import { CopyIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

function CourseOverview({ data }: { data: Course }) {
  return (
    <div className="w-full md:max-w-[65rem] flex flex-col gap-4 md:gap-6">
      <div className="relative w-full rounded-lg border border-border">
        <img
          src={data.image}
          alt="course-bg"
          className="w-[65rem] h-[10rem] md:h-[15rem] object-cover rounded-lg"
        />
        <Banner title={data.title} description={data.description!} />
      </div>
      <div className="flex">
        <CourseCode code={data.courseCode!} />
      </div>
    </div>
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

function CourseCode({ code }: { code: string }) {
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
    <div className="w-full md:w-fit flex items-center justify-between border border-border p-4 px-6 rounded-lg gap-6 md:px-4 md:pl-6">
      <div className="flex flex-col items-start gap-4">
        <h1>Course code</h1>
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
                className="w-8 h-8 md:w-5 md:h-5 text-orange-500"
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

export default CourseOverview;
