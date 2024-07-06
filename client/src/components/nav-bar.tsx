import { NavLink } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import LanguageToggle from "@/components/language-toggle";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

function Navbar({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const isLogin = localStorage.getItem("token") ? true : false;
  return (
    <nav
      className={twMerge(
        "fixed w-full flex justify-between items-center p-4 backdrop-blur-md bg-background/80 font-custom z-50 transition-colors duration-500 font-sans",
        className
      )}
    >
      <ul className="flex gap-4 items-center justify-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-orange-500" : "text-foreground"
          }
        >
          {t("nav.home")}
        </NavLink>
        <li>{t("nav.about")}</li>
        <li>{t("nav.contact")}</li>
      </ul>
      <div className="hidden md:flex md:gap-4">
        {isLogin ? (
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "hidden" : "block")}
          >
            <Button>{t("nav.dashboard")}</Button>
          </NavLink>
        ) : (
          <div className="flex gap-4">
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "hidden" : "block")}
            >
              <Button className="bg-orange-500 dark:text-white hover:bg-orange-700">
                {t("nav.login")}
              </Button>
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? "hidden" : "block")}
            >
              <Button variant="outline">{t("nav.register")}</Button>
            </NavLink>
          </div>
        )}
        <ModeToggle />
        <LanguageToggle />
      </div>
      <Drawer open={open} onOpenChange={setOpen} direction="top">
        <DrawerTrigger asChild className="md:hidden">
          <Button className="px-3 bg-orange-500">
            <MenuIcon size={20} />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-background dark:bg-dark-background text-current">
          <div className="flex flex-col gap-6 w-full h-full p-4 mt-12 items-center justify-start">
            <div className="flex gap-4">
              {isLogin ? (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => (isActive ? "hidden" : "block")}
                >
                  <Button>{t("nav.dashboard")}</Button>
                </NavLink>
              ) : (
                <div className="flex gap-4">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive ? "hidden" : "block"
                    }
                  >
                    <Button className="bg-orange-500 dark:text-white hover:bg-orange-700">
                      {t("nav.login")}
                    </Button>
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      isActive ? "hidden" : "block"
                    }
                  >
                    <Button variant="outline">{t("nav.register")}</Button>
                  </NavLink>
                </div>
              )}
              <ModeToggle />
              <LanguageToggle />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </nav>
  );
}

export default Navbar;
