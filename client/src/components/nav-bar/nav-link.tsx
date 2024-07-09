import { NavLink } from "react-router-dom";
import { User } from "@/contexts/auth-context";
import { sitemap } from "@/data/sitemap";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import Logo from "../logo";
import { twMerge } from "tailwind-merge";
import { ChevronRight } from "lucide-react";

function CustomNavLink({ user }: { user: User | null }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const filteredLinks = sitemap.filter((link) => {
    if (!user) {
      return link.auth === false && link.navigate === true;
    }
    return link.navigate === true;
  });

  return (
    <div>
      <div className="md:flex md:gap-4 md:items-center md:justify-center hidden">
        <Logo className="w-16 hidden md:block" />
        {filteredLinks.map((link) => (
          <NavLink
            key={link.title}
            to={link.path}
            className={({ isActive }) =>
              isActive ? "text-orange-500" : "text-foreground"
            }
          >
            {t(link.title)}
          </NavLink>
        ))}
      </div>
      <Drawer open={open} onOpenChange={setOpen} direction="left">
        <DrawerTrigger asChild className="md:hidden">
          <Button
            className="px-3 py-1 focus-visible:bg-muted flex gap-2 items-center justify-center text-base"
            variant="ghost"
          >
            <Logo className="w-12 md:hidden" />
            <p>
              {t(
                filteredLinks.find(
                  (link) => link.path === window.location.pathname
                )?.title!
              ) || "Lumen"}
            </p>
            <ChevronRight size={15} className="mt-[2px]" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="left-0 inset-0 bottom-0 h-full w-2/3 max-w-[350px] rounded-r-[10px]">
          <DrawerHeader className="hidden">
            <DrawerTitle>Navigation bar</DrawerTitle>
            <DrawerDescription>This is a navigation bar</DrawerDescription>
          </DrawerHeader>
          <div className="w-full h-full flex pr-4 items-center">
            <ScrollArea className="w-full h-full">
              <div className="flex flex-col gap-4 w-full h-full p-4 items-center">
                <div className="flex items-center gap-2 self-start">
                  <Logo className="w-16 ml-6" />
                  <h1 className="text-base font-bold font-sans">LMS</h1>
                </div>
                <Separator />
                <ul className="flex flex-col items-start justify-start w-full pl-4 gap-2">
                  {filteredLinks.map((link) => (
                    <li key={link.title} className="w-full">
                      <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                          twMerge(
                            "w-full flex gap-4 items-center py-2 px-4 backdrop-blur-md rounded-r-full",
                            isActive
                              ? "bg-orange-500/20 text-orange-500"
                              : "text-foreground"
                          )
                        }
                      >
                        {link.icon && <link.icon size={20} />}
                        <p className="truncate">{t(link.title)}</p>
                      </NavLink>
                    </li>
                  ))}
                </ul>
                <Separator />
              </div>
            </ScrollArea>
            <div className="mx-auto mb-4 h-[100px] w-2 rounded-full bg-muted" />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default CustomNavLink;
