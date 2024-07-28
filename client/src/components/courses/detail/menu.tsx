import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function CourseMenu() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        // if scrolling down, hide the navbar
        setShow(false);
      } else {
        // if scrolling up, show the navbar
        setShow(true);
      }

      // remember the current page location for the next move
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <ScrollArea className="relative w-full whitespace-nowrap">
      <div
        className={twMerge(
          "fixed z-10 w-full overflow-x-auto bg-background transition-all duration-300",
          show
            ? "translate-y-0"
            : "-translate-y-full bg-transparent md:translate-y-0 md:bg-background",
        )}
      >
        <div className="z-10 flex flex-row justify-evenly border-b border-border bg-transparent px-4 text-base transition-colors duration-300 md:ml-[12rem] md:justify-start md:gap-0 md:bg-background md:pl-8 lg:ml-[14rem]">
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
          "flex h-14 flex-col items-center justify-center hover:cursor-pointer",
          isActive
            ? "text-orange-500 after:h-1 after:w-full after:translate-y-[0.9rem] after:rounded-t-md after:bg-orange-500 after:content-[''] hover:bg-orange-500/20"
            : "hover:bg-muted",
          className,
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
