"use client";
import React from "react";
import { useThemeToggle } from "@/components/ui/light-dark";

const Navbar = () => {
  const { toggleTheme } = useThemeToggle();

  return (
    <div className=" fixed flex bg-background  min-w-[90vw]  justify-between h-[60px] items-center   top-0  left-1/2 -translate-x-1/2 border-b  border-x px-4 py-4 z-50">
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
  );
};

export default Navbar;
