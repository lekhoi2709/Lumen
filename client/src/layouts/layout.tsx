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
    <div
      className={twMerge(
        "min-h-screen flex flex-col items-center justify-between",
        className
      )}
    >
      <Navbar className="self-start fixed" />
      <main className="w-full min-h-screen h-full flex-1 mt-[72px] md:flex justify-start bg-background">
        {sidebar && <NavigateListDesktop data={mainRoutes} />}
        <section className="w-full min-h-screen h-full md:rounded-l-[10px] bg-muted">
          {children}
        </section>
      </main>
      {footer && <Footer />}
    </div>
  );
}

export default Layout;
