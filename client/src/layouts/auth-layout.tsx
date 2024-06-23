import React from "react";
import AuthBg from "@/assets/auth-bg.jpg";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center relative">
      <div className="w-full h-full absolute z-0">
        <img
          src={AuthBg}
          alt="background"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
      {children}
      <span className="absolute z-10 bottom-0 right-0 p-2 lg:p-3 bg-background/80 backdrop-blur-md rounded-tl-md text-sm lg:text-base transition-colors duration-500">
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
