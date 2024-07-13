import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";

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
    <ul className="md:flex md:flex-col md:gap-4 md:items-center md:justify-start hidden w-1/5 max-w-[200px] pt-4 pr-2 bg-background">
      {data.map((link) => (
        <li key={link.title + "-desktop"} className="w-full">
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
          >
            {link.icon && <link.icon size={20} />}
            <p className="truncate">{t(link.title)}</p>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export { NavigateList, NavigateListDesktop };
