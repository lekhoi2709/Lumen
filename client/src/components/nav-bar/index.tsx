import { NavLink } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import LanguageToggle from "@/components/nav-bar/language-toggle";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/auth-context";
import { TFunction } from "i18next";
import NavDrawer from "./nav-drawer";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import CustomNavLink from "./nav-link";
import { User } from "@/types/user";
import UpdateCourseDialog from "../courses/detail/course-setting";
import { useLocation } from "react-router-dom";

function Navbar({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { user, logoutAct } = useAuth();
  const location = useLocation();

  return (
    <nav
      className={twMerge(
        "font-custom fixed z-50 flex w-full items-center justify-between bg-background/80 p-4 font-nunito backdrop-blur-md transition-colors duration-500",
        className,
      )}
    >
      <CustomNavLink user={user} />
      <div className="hidden md:flex md:gap-4">
        {user ? (
          <UserSection user={user} t={t} logoutAct={logoutAct} />
        ) : (
          <LoginSection t={t} />
        )}
        <ModeToggle />
        <LanguageToggle />
      </div>
      <div className="flex items-center gap-4 md:hidden">
        {location.pathname.includes("courses/") && (
          <UpdateCourseDialog device="mobile" />
        )}
        <NavDrawer user={user} t={t} />
      </div>
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
    <section className="flex items-center gap-4 font-nunito">
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
    <section className="flex gap-4 font-nunito">
      <NavLink
        to="/login"
        className={({ isActive }) => (isActive ? "hidden" : "block")}
      >
        <Button className="bg-orange-500 hover:bg-orange-700 dark:text-white">
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
