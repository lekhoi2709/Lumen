import React from "react";
import Navbar from "@/components/nav-bar/index";
import Footer from "@/components/footer";
import { twMerge } from "tailwind-merge";
import { NavigateListDesktop } from "@/components/nav-bar/nav-link-list";
import { mainRoutes } from "@/data/sitemap";
import { Toaster } from "@/components/ui/toaster";

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
    <div className="flex min-h-screen flex-col items-center justify-between font-nunito">
      <Navbar className="fixed self-start border-b border-border font-nunito" />
      <main
        className={twMerge(
          "relative h-full min-h-screen w-full flex-1 justify-start bg-background pt-[72px] md:flex",
          className,
        )}
      >
        {sidebar && <NavigateListDesktop data={mainRoutes} />}
        <section className="h-full min-h-screen w-full">{children}</section>
      </main>
      <Toaster />
      {footer && <Footer />}
    </div>
  );
}

export default Layout;
