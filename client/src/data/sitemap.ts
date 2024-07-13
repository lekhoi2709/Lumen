import {
  LayoutDashboardIcon,
  HomeIcon,
  ShapesIcon,
  CalendarCheck2Icon,
  BookOpenCheckIcon,
} from "lucide-react";

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

export const mainRoutes = [
  {
    title: "nav.courses",
    path: "/courses",
    icon: ShapesIcon,
  },
  {
    title: "nav.schedule",
    path: "/schedule",
    icon: CalendarCheck2Icon,
  },
  {
    title: "nav.gradebook",
    path: "/gradebook",
    icon: BookOpenCheckIcon,
  },
];
