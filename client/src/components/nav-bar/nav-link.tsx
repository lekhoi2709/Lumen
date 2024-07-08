import { NavLink } from "react-router-dom";
import { User } from "@/contexts/auth-context";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useTheme } from "@/contexts/theme-provider";
import { sitemap } from "@/data/sitemap";
import { useTranslation } from "react-i18next";

function CustomNavLink({ user }: { user: User | null }) {
  const themeSetting = useTheme();
  const { t } = useTranslation();

  const filteredLinks = sitemap.filter((link) => {
    if (!user) {
      return link.auth === false && link.navigate === true;
    }
    return link.navigate === true;
  });

  return (
    <div>
      <div className="md:flex md:gap-4 md:items-center md:justify-center hidden">
        <img
          src={
            themeSetting.theme === "light"
              ? "/logo/logo-no-background.png"
              : "/logo/logo-no-bg-white.png"
          }
          alt="Lumen Nav Logo"
          className="h-auto max-w-full w-16 object-fill hidden md:block"
        />
        {filteredLinks.map((link) => (
          <NavLink
            key={link.title}
            to={link.path}
            className={({ isActive }) =>
              isActive ? "text-orange-500" : "text-foreground"
            }
          >
            {t(link.title)}
          </NavLink>
        ))}
      </div>
      <NavigationMenu className="md:hidden">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="border-none bg-transparent text-base">
              <div className="flex gap-2 items-center">
                <img
                  src={
                    themeSetting.theme === "light"
                      ? "/logo/logo-no-background.png"
                      : "/logo/logo-no-bg-white.png"
                  }
                  alt="Lumen Nav Logo"
                  className="h-auto max-w-full w-12 object-fill md:hidden"
                />
                <p>
                  {t(
                    filteredLinks.find(
                      (link) => link.path === window.location.pathname
                    )?.title!
                  ) || "Lumen"}
                </p>
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex flex-col p-4 gap-6">
                {filteredLinks.map(
                  (link) =>
                    link.path !== window.location.pathname && (
                      <li key={link.title} className="">
                        <NavigationMenuLink asChild>
                          <NavLink to={link.path}>{t(link.title)}</NavLink>
                        </NavigationMenuLink>
                      </li>
                    )
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default CustomNavLink;
