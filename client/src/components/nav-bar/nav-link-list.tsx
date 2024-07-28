import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "../ui/scroll-area";

type DataProps = {
  title: string;
  path: string;
  icon?: any;
  auth?: boolean;
  navigate?: boolean;
};

function NavigateList({ data }: { data: DataProps[] }) {
  const { t } = useTranslation();

  return (
    <ul className="flex w-full flex-col items-start justify-start gap-2">
      {data.map((link) => (
        <li key={link.title} className="w-full">
          <NavLink
            to={link.path}
            className={({ isActive }) =>
              twMerge(
                "flex w-full items-center gap-4 rounded-r-full px-4 py-2 backdrop-blur-md",
                isActive
                  ? "bg-orange-500/20 text-orange-500"
                  : "text-foreground",
              )
            }
            onClick={() => sessionStorage.setItem("history", link.path)}
          >
            {link.icon && <link.icon size={20} />}
            <p className="truncate">{t(link.title)}</p>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function NavigateListDesktop({ data }: { data: DataProps[] }) {
  const { t } = useTranslation();

  return (
    <div className="fixed z-20 hidden h-full w-[12rem] border-r border-border bg-background md:inline-block lg:w-[14rem]">
      <ScrollArea className="h-full w-full">
        <ul className="h-full w-full pr-2 pt-4 md:flex md:flex-col md:items-center md:justify-start">
          {data.map((link) => (
            <li key={link.title + "-desktop"} className="w-full">
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  twMerge(
                    "flex w-full items-center gap-4 rounded-r-full px-4 py-3 backdrop-blur-md",
                    isActive
                      ? "bg-orange-500/20 text-orange-500 hover:bg-orange-500/30"
                      : "text-foreground hover:bg-muted",
                  )
                }
                onClick={() => sessionStorage.setItem("history", link.path)}
              >
                {link.icon && <link.icon size={20} />}
                <p className="truncate">{t(link.title)}</p>
              </NavLink>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}

export { NavigateList, NavigateListDesktop };
