import React from "react";
import Navbar from "@/components/nav-bar/index";
import Footer from "@/components/footer";
import { twMerge } from "tailwind-merge";

function Layout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "min-h-screen flex flex-col items-center justify-between",
        className
      )}
    >
      <Navbar className="self-start fixed" />
      <main className="w-full h-full flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
