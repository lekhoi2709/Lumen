import { useTheme } from "@/contexts/theme-provider";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

function Footer({ className }: { className?: string }) {
  const { t } = useTranslation();
  const data = [
    {
      title: t("footer.contact"),
      items: [
        {
          title: "lumenn.lms@gmail.com",
          link: "mailto:lumenn.lms@gmail.com",
        },
        {
          title: "(+1) 234-567-890",
          link: "tel:+1234567890",
        },
        {
          title: t("footer.address"),
          link: "#",
        },
      ],
    },
    {
      title: t("footer.about"),
      items: [
        {
          title: t("footer.mission"),
          link: "#",
        },
        {
          title: t("footer.team"),
          link: "#",
        },
        {
          title: t("footer.blog"),
          link: "#",
        },
      ],
    },
    {
      title: t("footer.links"),
      items: [
        {
          title: t("footer.help"),
          link: "#",
        },
        {
          title: t("footer.faq"),
          link: "#",
        },
        {
          title: t("footer.privacy"),
          link: "#",
        },
        {
          title: t("footer.terms"),
          link: "#",
        },
      ],
    },
  ];
  const themeSetting = useTheme();

  return (
    <footer
      className={twMerge(
        "rounded-t-md w-full flex flex-col items-center justify-center p-6 bg-orange-500 gap-8",
        className
      )}
    >
      <div className="w-full max-w-[900px] flex flex-wrap items-start justify-center text-sm gap-8 md:flex-row md:text-base md:gap-12 text-foreground">
        <div className="relative w-32 md:w-48">
          <img
            src={
              themeSetting.theme === "light"
                ? "/logo/logo-no-background.png"
                : "/logo/logo-no-bg-white.png"
            }
            alt="Lumen Logo"
            className="h-auto max-w-full object-fill"
            loading="eager"
          />
        </div>
        {data.map((section, index) => (
          <div
            key={index}
            className="flex flex-col gap-6 items-start max-w-32 w-32 md:w-auto md:max-w-none"
          >
            <h3 className="text-lg font-bold">{section.title}</h3>
            <ul className="flex flex-col gap-2 items-start">
              {section.items.map((item, index) => (
                <li key={index}>
                  <a href={item.link}>{item.title}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-md-12">
          <p className="text-xs md:text-sm text-foreground">
            2024 Lumen LMS. Built by LDK, VLTP
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
