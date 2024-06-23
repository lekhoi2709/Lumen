import { NavLink } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import LanguageToggle from "@/components/language-toggle";
import { useTranslation } from "react-i18next";

const isActive = ({ isActive }: any) => `link ${isActive ? "active" : ""}`;

function Navbar() {
  const { t } = useTranslation();
  return (
    <nav className="fixed w-full flex justify-between items-center p-4 backdrop-blur-md bg-background/80 font-custom z-50 transition-colors duration-500 font-sans">
      <ul className="flex gap-4">
        <NavLink to="/" className={isActive}>
          {t("nav.home")}
        </NavLink>
        <li>{t("nav.about")}</li>
        <li>{t("nav.contact")}</li>
      </ul>
      <div className="flex gap-4">
        <ModeToggle />
        <LanguageToggle />
      </div>
    </nav>
  );
}

export default Navbar;
