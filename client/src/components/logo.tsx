import { useTheme } from "@/contexts/theme-provider";
import { twMerge } from "tailwind-merge";

function Logo({
  className,
  loading,
}: {
  className?: string;
  loading?: "lazy" | "eager" | undefined;
}) {
  const themeSetting = useTheme();

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  let imgSrc: string;
  if (themeSetting.theme === "system") {
    imgSrc =
      systemTheme === "light"
        ? "/logo/logo-no-background.png"
        : "/logo/logo-no-bg-white.png";
  } else {
    imgSrc =
      themeSetting.theme === "light"
        ? "/logo/logo-no-background.png"
        : "/logo/logo-no-bg-white.png";
  }

  return (
    <img
      src={imgSrc}
      alt="Lumen Logo"
      className={twMerge("h-auto max-w-full object-fill", className)}
      loading={loading}
    />
  );
}

export default Logo;
