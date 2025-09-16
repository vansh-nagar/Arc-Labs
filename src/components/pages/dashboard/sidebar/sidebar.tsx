"use client";
import React from "react";
import { FileText, Zap, Send, Map, Monitor, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/stores/sidebarStore";
import Link from "next/link";

import SideBarBottom from "./sub-pages/side-bar-bottom";
import SideBarTop from "./sub-pages/side-bar-top";
const sidebarPages = [
  {
    label: "Generate Resume",
    icon: <FileText />,
    path: "/dashboard/generate-resume",
  },
  {
    label: "Roast My Resume",
    icon: <Zap />,
    path: "/dashboard/roast-resume",
  },
  {
    label: "Find & Apply",
    icon: <Send />,
    path: "/dashboard/find_apply",
  },
  {
    label: "Build My Roadmap",
    icon: <Map />,
    path: "/dashboard/build_roadmap",
  },
  {
    label: "Simulate Interview",
    icon: <Monitor />,
    path: "/dashboard/simulate_interview",
  },
  {
    label: "LeetCode Daily",
    icon: <Calendar />,
    path: "/dashboard/leetcode_daily",
  },
];
const Side_bar = () => {
  const { isSideBarOpen } = useSidebarStore();

  return (
    <div
      className={`     fixed text left-0 bottom-0 top-0    overflow-hidden  border-r border-dashed h-screen z-30  bg-background ${
        isSideBarOpen ? "w-64" : "w-14 max-sm:w-0"
      }  max-h-[100vh]   transition-all duration-150 z-50`}
    >
      <SideBarTop />

      <div className="px-3 mt-4">
        <h1 className="px-1 font-bold ">{isSideBarOpen ? "Playground" : ""}</h1>
        <div className="mt-2 flex flex-col gap-1">
          {sidebarPages.map((page, index) => (
            <Button key={index} variant={"ghost"} size={"default"}>
              <Link
                href={page.path}
                className=" flex justify-start items-center gap-2 w-full"
              >
                {page.icon} {isSideBarOpen ? page.label : ""}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <SideBarBottom />
    </div>
  );
};

export default Side_bar;
