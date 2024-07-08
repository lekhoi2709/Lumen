import { useTheme } from "@/contexts/theme-provider";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { data } from "@/data/footer";

function Footer({ className }: { className?: string }) {
  const { t } = useTranslation();
  const themeSetting = useTheme();

  return (
    <footer
      className={twMerge(
        "rounded-t-[10px] w-full flex flex-col items-center justify-center p-6 bg-orange-500 gap-8 transition-colors duration-300 ease-in-out text-foreground",
        className
      )}
    >
      <div className="w-full max-w-[900px] flex flex-wrap items-start justify-center text-sm gap-8 md:flex-row md:text-base md:gap-12">
        <div className="relative w-32 md:w-48 self-center md:self-start">
          <img
            src={
              themeSetting.theme === "light"
                ? "/logo/logo-no-background.png"
                : "/logo/logo-no-bg-white.png"
            }
            alt="Lumen Logo"
            className="h-auto max-w-full object-fill top-1/2"
            loading="lazy"
          />
        </div>
        {data.map((section, index) => (
          <div
            key={index}
            className="flex flex-col gap-6 items-start max-w-32 w-32 md:w-auto md:max-w-none"
          >
            <h3 className="text-lg font-bold">{t(section.title)}</h3>
            <ul className="flex flex-col gap-2 items-start">
              {section.items.map((item, index) => (
                <li key={index}>
                  <a href={item.link}>{t(item.title)}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-md-12">
          <p className="text-xs md:text-sm transition-colors duration-300 ease-in-out text-foreground">
            2024 Lumen LMS. Built by LDK, VLTP
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
