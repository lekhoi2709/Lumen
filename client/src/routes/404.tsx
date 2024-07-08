import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

function PageNotFound() {
  const { t } = useTranslation();
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-6">{t("404.title")}</h1>
      <p className="text-gray-500 mb-8">{t("404.message")}</p>

      <div className="flex flex-col items-center gap-4">
        <NavLink to="/">
          <Button className="bg-orange-500 dark:text-white hover:bg-orange-700">
            {t("404.back")}
          </Button>
        </NavLink>
        <a
          href="mailto:support@lumen.com"
          className="text-blue-500 hover:text-blue-600 underline"
        >
          {t("404.contact")}
        </a>
      </div>
    </div>
  );
}

export default PageNotFound;
