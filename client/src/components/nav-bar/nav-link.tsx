import { NavLink } from "react-router-dom";
import { sitemap, mainRoutes } from "@/data/sitemap";
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
import { ChevronRight } from "lucide-react";
import { NavigateList } from "./nav-link-list";
import { User } from "@/types/user";

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
      <div className="md:flex md:gap-4 md:items-center md:justify-center hidden font-nunito">
        <Logo className="w-16 hidden md:block" />
        {filteredLinks.map((link) => (
          <NavLink
            key={link.title}
            to={link.path}
            className={({ isActive }) =>
              isActive ? "text-orange-500" : "text-foreground"
            }
            onClick={() => sessionStorage.setItem("history", link.path)}
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
            <ChevronRight size={15} className="mt-[1px]" />
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
                <NavigateList data={filteredLinks} />
                {user && <Separator />}
                {user && <NavigateList data={mainRoutes} />}
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
