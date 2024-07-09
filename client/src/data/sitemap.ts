import { LayoutDashboardIcon } from "lucide-react";
import { HomeIcon } from "lucide-react";

export const sitemap = [
  {
    title: "nav.home",
    path: "/",
    auth: false,
    navigate: true,
    icon: HomeIcon,
  },
  {
    title: "nav.dashboard",
    path: "/dashboard",
    auth: true,
    navigate: true,
    icon: LayoutDashboardIcon,
  },
  {
    title: "nav.login",
    path: "/login",
    auth: false,
    navigate: false,
  },
  {
    title: "nav.register",
    path: "/register",
    auth: false,
    navigate: false,
  },
  {
    title: "forgot.title",
    path: "/verify-user",
    auth: false,
    navigate: false,
  },
  {
    title: "forgot.reset",
    path: "/reset-password",
    auth: false,
    navigate: false,
  },
];
