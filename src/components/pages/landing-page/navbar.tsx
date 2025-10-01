"use client";
import React from "react";
import { useThemeToggle } from "@/components/ui/light-dark";

const Navbar = () => {
  const { toggleTheme } = useThemeToggle();

  return (
    <div className="fixed right-0 left-0 top-0 flex justify-center items-center z-50">
      <div className="  flex bg-background  min-w-[90vw]  justify-between h-[60px] items-center     border-b  border-x px-4 py-4 ">
        <img
          src="/logo/logo-light.svg"
          alt=""
          className=" w-10  mix-blend-difference  cursor-pointer "
          onClick={() => {
            toggleTheme();
          }}
        />
        <div className="text-sm ">link... </div>
      </div>
    </div>
  );
};

export default Navbar;
