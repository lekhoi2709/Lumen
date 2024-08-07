import { TFunction } from "i18next";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import LanguageToggle from "@/components/nav-bar/language-toggle";
import { UserSection, LoginSection } from ".";
import { useAuth } from "@/contexts/auth-context";
import { User } from "@/types/user";

function NavDrawer({
  user,
  t,
}: {
  user: User | null;
  t: TFunction<"translation", undefined>;
}) {
  const [open, setOpen] = useState(false);
  const { logoutAct } = useAuth();

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="top">
      <DrawerTrigger asChild className="md:hidden">
        <Button className="px-3 bg-orange-500">
          <MenuIcon size={20} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="top-0 rounded-b-[10px] ">
        <DrawerHeader className="hidden">
          <DrawerTitle>Navigation bar</DrawerTitle>
          <DrawerDescription>This is a navigation bar</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-6 w-full h-full p-4 mt-12 items-center">
          <div className="flex gap-4">
            {user ? (
              <UserSection user={user} t={t} logoutAct={logoutAct} />
            ) : (
              <LoginSection t={t} />
            )}
          </div>
          <div className="flex gap-4">
            <ModeToggle />
            <LanguageToggle />
          </div>
        </div>
        <div className="mx-auto mb-4 h-2 w-[100px] rounded-full bg-muted" />
      </DrawerContent>
    </Drawer>
  );
}

export default NavDrawer;
