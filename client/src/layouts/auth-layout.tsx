import React from "react";
import AuthBg from "@/assets/auth-bg.jpg";
import Navbar from "@/components/nav-bar/index";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-between relative md:gap-8">
      <Navbar className="static" />
      <div className="w-full h-full absolute z-0">
        <img
          src={AuthBg}
          alt="background"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
      {children}
      <span className="z-10 self-end p-2 lg:p-3 bg-background/80 backdrop-blur-md rounded-tl-md text-sm lg:text-base transition-colors duration-500">
        <p>
          Designed by{" "}
          <a
            href="https://www.freepik.com/"
            target="_blank"
            className="text-blue-500"
          >
            Freepik
          </a>
        </p>
      </span>
    </div>
  );
}

export default AuthLayout;
