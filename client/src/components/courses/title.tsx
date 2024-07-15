import CourseDialog from "./course-dialog";
import { useTranslation } from "react-i18next";

function Title() {
  const { t } = useTranslation();

  return (
    <section className="flex justify-between items-center">
      <h1 className="text-xl font-bold">{t("courses.title")}</h1>
      <CourseDialog />
    </section>
  );
}

export default Title;
