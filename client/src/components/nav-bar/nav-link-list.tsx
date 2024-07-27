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
    <ul className="flex flex-col items-start justify-start w-full gap-2">
      {data.map((link) => (
        <li key={link.title} className="w-full">
          <NavLink
            to={link.path}
            className={({ isActive }) =>
              twMerge(
                "w-full flex gap-4 items-center py-2 px-4 backdrop-blur-md rounded-r-full",
                isActive
                  ? "bg-orange-500/20 text-orange-500"
                  : "text-foreground"
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
    <div className="hidden md:inline-block w-[12rem] lg:w-[14rem] h-full bg-background border-r border-border fixed z-10">
      <ScrollArea className="w-full h-full">
        <ul className="md:flex md:flex-col md:items-center md:justify-start w-full h-full pt-4 pr-2">
          {data.map((link) => (
            <li key={link.title + "-desktop"} className="w-full">
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  twMerge(
                    "w-full flex gap-4 items-center py-3 px-4 backdrop-blur-md rounded-r-full",
                    isActive
                      ? "bg-orange-500/20 text-orange-500 hover:bg-orange-500/30"
                      : "text-foreground hover:bg-muted"
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
