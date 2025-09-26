"use client";
import React from "react";
import { FileText, Zap, Send, Map, Monitor, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/stores/sidebarStore";

import SideBarBottom from "./sub-pages/side-bar-bottom";
import SideBarTop from "./sub-pages/side-bar-top";
import { useRouter } from "next/navigation";
import Link from "next/link";
const sidebarPages = [
  {
    label: "Generate Resume",
    icon: <FileText />,
    path: "/dashboard/generate-resume/page1",
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
    path: "/dashboard/build-my-roadmap/page1",
  },
  {
    label: "Simulate Interview",
    icon: <Monitor />,
    path: "/dashboard/simulate-interview/page1",
  },
  {
    label: "LeetCode Daily",
    icon: <Calendar />,
    path: "/dashboard/leetcode_daily",
  },
];
const Side_bar = () => {
  const { isSideBarOpen } = useSidebarStore();
  const router = useRouter();

  return (
    <div
      className={`     fixed text left-0 bottom-0 top-0    overflow-hidden  border-r border-dashed h-screen z-30  bg-background ${
        isSideBarOpen ? "w-64" : "w-14 max-sm:w-0"
      }  max-h-[100vh]   transition-all duration-75 z-50`}
    >
      <SideBarTop />

      <div className="px-3 mt-4">
        <h1 className="px-1 font-bold ">{isSideBarOpen ? "Playground" : ""}</h1>
        <div className="mt-2 flex flex-col gap-1">
          {sidebarPages.map((page, index) => (
            <Link key={index} href={page.path}>
              <Button
                className={`w-full ${
                  isSideBarOpen ? "justify-start" : "justify-center"
                } cursor-pointer`}
                variant="ghost"
                size="default"
                key={index}
              >
                {page.icon}
                {isSideBarOpen && page.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <SideBarBottom />
    </div>
  );
};

export default Side_bar;
