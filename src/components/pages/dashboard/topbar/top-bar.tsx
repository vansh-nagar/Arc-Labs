"use client";
import React from "react";
import { useSidebarStore } from "@/stores/sidebarStore";
import { PanelRight, PanelRightClose } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const Top_bar = () => {
  const { isSideBarOpen, setIsSideBarOpen } = useSidebarStore();

  return (
    <div
      className={`  h-16 fixed top-0  right-0   bg-background z-50  ${
        isSideBarOpen ? "left-64 max-sm:left-0" : "left-14 max-sm:left-0 "
      } px-4 flex border-b border-dashed items-center  justify-between bg-background  transition-all duration-150`}
    >
      <h1 className=" font-bold text-lg max-sm:hidden ">Dashboard</h1>

      <div className="  sm:hidden">
        {isSideBarOpen ? (
          <PanelRight
            size={15}
            className=" cursor-pointer text-neutral-500 "
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          />
        ) : (
          <PanelRightClose
            size={15}
            className=" cursor-pointer  "
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          />
        )}
      </div>

      <HoverCard>
        <HoverCardTrigger>
          <img
            src="https://i.pinimg.com/736x/a4/11/f9/a411f94f4622cfa7c1a87f4f79328064.jpg"
            alt="Open popover"
            className=" w-10 rounded-full   "
          />
        </HoverCardTrigger>
        <HoverCardContent className=" border  rounded-lg bg-background mr-3 mt-2 ">
          <div className=" flex justify-center items-center flex-col gap-3 py-5 m-2 bg-accent rounded-md shadow-md">
            <img
              src="https://i.pinimg.com/736x/a4/11/f9/a411f94f4622cfa7c1a87f4f79328064.jpg"
              alt="Open popover"
              className=" w-16 rounded-full  border-4 border-destructive    border-double "
            />
            <h2>username - vansh nagar</h2>
          </div>
          <div className="flex flex-col min-w-80 px-2 pb-2 ">
            <div className="flex items-center text-sm hover:bg-accent py-2 px-3 gap-2 rounded-md shadow-inner  hover:shadow-md transition-all duration-150">
              <PanelRight size={16} className="text-neutral-500" />
              <Button
                variant="ghost"
                size={"sm"}
                className="w-full text-left"
                onClick={() => signOut()}
              >
                Sign out
              </Button>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default Top_bar;
