import React from "react";
import Navbar from "@/components/nav-bar";
import Footer from "@/components/footer";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-between">
      <Navbar className="self-start static" />
      <main className="w-full h-full flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
