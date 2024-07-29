import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { googleAuth } from "@/services/api/auth-api";

function GoogleButton() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const openGoogleAuth = async () => {
    setLoading(true);
    await googleAuth()
      .then((res) => {
        window.open(res.url, "_self");
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  return (
    <Button
      className="flex w-full items-center justify-center gap-4 py-6 transition-transform duration-500 ease-in-out hover:scale-[1.03]"
      type="button"
      onClick={() => openGoogleAuth()}
    >
      {!loading && (
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30.0014 16.3109C30.0014 15.1598 29.9061 14.3198 29.6998 13.4487H16.2871V18.6442H24.1601C24.0014 19.9354 23.1442 21.8798 21.2394 23.1864L21.2127 23.3604L25.4536 26.58L25.7474 26.6087C28.4458 24.1665 30.0014 20.5731 30.0014 16.3109Z"
            fill="#4285F4"
          />
          <path
            d="M16.2862 30C20.1433 30 23.3814 28.7555 25.7465 26.6089L21.2386 23.1865C20.0322 24.011 18.4132 24.5866 16.2862 24.5866C12.5085 24.5866 9.30219 22.1444 8.15923 18.7688L7.9917 18.7827L3.58202 22.1272L3.52435 22.2843C5.87353 26.8577 10.6989 30 16.2862 30Z"
            fill="#34A853"
          />
          <path
            d="M8.16007 18.7688C7.85848 17.8977 7.68395 16.9643 7.68395 15.9999C7.68395 15.0354 7.85849 14.1021 8.1442 13.231L8.13621 13.0455L3.67126 9.64734L3.52518 9.71544C2.55696 11.6132 2.0014 13.7444 2.0014 15.9999C2.0014 18.2555 2.55696 20.3865 3.52518 22.2843L8.16007 18.7688Z"
            fill="#FBBC05"
          />
          <path
            d="M16.2863 7.4133C18.9688 7.4133 20.7783 8.54885 21.8101 9.4978L25.8418 5.64C23.3657 3.38445 20.1434 2 16.2863 2C10.699 2 5.87354 5.1422 3.52435 9.71549L8.14339 13.2311C9.30223 9.85555 12.5086 7.4133 16.2863 7.4133Z"
            fill="#EB4335"
          />
        </svg>
      )}
      {!loading && (
        <span className="text-xs md:text-base">{t("login.google")}</span>
      )}
      {loading && <Loader2Icon size={24} className="animate-spin" />}
    </Button>
  );
}

export default GoogleButton;
