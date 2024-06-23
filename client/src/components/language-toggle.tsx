import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ViSVG from "@/assets/icons/vi.svg?react";
import EnSVG from "@/assets/icons/en.svg?react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { icon: <EnSVG />, label: "English", value: "en" },
  { icon: <ViSVG />, label: "Vietnamese", value: "vi" },
];

function LanguageToggle() {
  const { i18n } = useTranslation();

  const onChangeLang = (lang_code: string) => {
    i18n.changeLanguage(lang_code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="px-2">
          {i18n.language === "en" ? <EnSVG /> : <ViSVG />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => onChangeLang(lang.value)}
          >
            <span className="flex gap-2 items-center">
              {lang.icon}
              <p>{lang.label}</p>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageToggle;
