import { NavLink } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import LanguageToggle from "@/components/nav-bar/language-toggle";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { Button } from "../ui/button";
import { useAuth, User } from "@/contexts/auth-context";
import { TFunction } from "i18next";
import NavDrawer from "./nav-drawer";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import CustomNavLink from "./nav-link";

function Navbar({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { user, logoutAct } = useAuth();

  return (
    <nav
      className={twMerge(
        "fixed w-full flex justify-between items-center p-4 backdrop-blur-md bg-background/80 font-custom z-50 transition-colors duration-500 font-sans",
        className
      )}
    >
      <CustomNavLink user={user} t={t} />
      <div className="hidden md:flex md:gap-4">
        {user ? (
          <UserSection user={user} t={t} logoutAct={logoutAct} />
        ) : (
          <LoginSection t={t} />
        )}
        <ModeToggle />
        <LanguageToggle />
      </div>
      <NavDrawer user={user} t={t} />
    </nav>
  );
}

function UserSection({
  user,
  t,
  logoutAct,
}: {
  user: User;
  t: TFunction<"translation", undefined>;
  logoutAct: () => void;
}) {
  return (
    <section className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src={user.avatarUrl} alt="User avatar" />
        <AvatarFallback>{user.firstName.split("")[0]}</AvatarFallback>
      </Avatar>
      <p>
        {user.firstName} {user.lastName}
      </p>
      <Button variant="destructive" onClick={() => logoutAct()}>
        {t("nav.logout")}
      </Button>
    </section>
  );
}

function LoginSection({ t }: { t: TFunction<"translation", undefined> }) {
  return (
    <section className="flex gap-4">
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
    </section>
  );
}

export default Navbar;
export { UserSection, LoginSection };
