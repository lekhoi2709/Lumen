import React from "react";
import Navbar from "@/components/nav-bar/index";
import Footer from "@/components/footer";
import { twMerge } from "tailwind-merge";
import { NavigateListDesktop } from "@/components/nav-bar/nav-link-list";
import { mainRoutes } from "@/data/sitemap";

function Layout({
  children,
  className,
  footer = false,
  sidebar = true,
}: {
  children: React.ReactNode;
  className?: string;
  footer?: boolean;
  sidebar?: boolean;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between font-nunito">
      <Navbar className="self-start fixed border-b border-border font-nunito" />
      <main
        className={twMerge(
          "w-full min-h-screen h-full flex-1 md:flex justify-start bg-background pt-[72px] relative",
          className
        )}
      >
        {sidebar && <NavigateListDesktop data={mainRoutes} />}
        <section className="w-full min-h-screen h-full">{children}</section>
      </main>
      {footer && <Footer />}
    </div>
  );
}

export default Layout;
