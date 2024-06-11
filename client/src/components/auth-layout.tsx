import React from "react";
import AuthBg from "@/assets/auth-bg.jpg";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen flex">
      <div className="w-full h-full absolute z-0">
        <img
          src={AuthBg}
          alt="background"
          className="w-full h-full object-cover lg:object-fill"
        />
      </div>
      <section className="z-10 w-full h-full flex items-center justify-center">
        {children}
      </section>
      <span className="absolute z-10 bottom-0 right-0 p-3 bg-white backdrop-blur-sm rounded-md">
        <p className="">
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
