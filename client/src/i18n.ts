import i18n from "i18next";
import i18nBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(i18nBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: localStorage.getItem("lang") || "en",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: `${window.location.origin}/locales/{{lng}}.json`,
    },
  });

export default i18n;
