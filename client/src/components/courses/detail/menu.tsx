import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useParams } from "react-router-dom";

function CourseMenu() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex flex-row justify-center px-4 border-b border-border w-full z-10 bg-background md:fixed md:ml-[12rem] md:justify-start md:gap-0 md:pl-8 text-base lg:ml-[14rem]">
        <StyledNavLink path={`/courses/${id}`}>
          {t("courses.detail.overview")}
        </StyledNavLink>
        <StyledNavLink path={`/courses/${id}/assignments`}>
          {t("courses.detail.assignments")}
        </StyledNavLink>
        <StyledNavLink path={`/courses/${id}/people`}>
          {t("courses.detail.people")}
        </StyledNavLink>
        <StyledNavLink path={`/courses/${id}/grades`}>
          {t("courses.detail.grades")}
        </StyledNavLink>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

function StyledNavLink({
  path,
  className,
  children,
}: {
  path: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        twMerge(
          "h-14 flex flex-col items-center justify-center hover:cursor-pointer",
          isActive
            ? "text-orange-500 after:content-[''] after:w-full after:h-1 after:rounded-t-md after:bg-orange-500 after:translate-y-[0.9rem] hover:bg-orange-500/20"
            : "hover:bg-muted",
          className
        )
      }
      onClick={() => sessionStorage.setItem("history", path)}
      replace
      end
    >
      <span className="px-4 md:px-6">{children}</span>
    </NavLink>
  );
}

export default CourseMenu;
