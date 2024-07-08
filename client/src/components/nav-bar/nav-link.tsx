import { NavLink } from "react-router-dom";
import { User } from "@/contexts/auth-context";
import { TFunction } from "i18next";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useTheme } from "@/contexts/theme-provider";

function CustomNavLink({
  user,
  t,
}: {
  user: User | null;
  t: TFunction<"translation", undefined>;
}) {
  const links = [
    { title: t("nav.home"), path: "/" },
    { title: t("nav.dashboard"), path: "/dashboard" },
    { title: t("nav.about"), path: "/about" },
    { title: t("nav.contact"), path: "/contact" },
  ];
  const themeSetting = useTheme();
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
        {links
          .filter((link) => {
            if (!user) {
              return link.title !== t("nav.dashboard");
            }
            return link;
          })
          .map((link) => (
            <NavLink
              key={link.title}
              to={link.path}
              className={({ isActive }) =>
                isActive ? "text-orange-500" : "text-foreground"
              }
            >
              {link.title}
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
                  {links.find((link) => link.path === window.location.pathname)
                    ?.title || "Lumen"}
                </p>
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="flex flex-col p-4 gap-6">
                {links
                  .filter((link) => {
                    if (!user) {
                      return link.title !== t("nav.dashboard");
                    }
                    return link;
                  })
                  .map(
                    (link) =>
                      link.path !== window.location.pathname && (
                        <li key={link.title} className="">
                          <NavigationMenuLink asChild>
                            <NavLink to={link.path}>{link.title}</NavLink>
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
