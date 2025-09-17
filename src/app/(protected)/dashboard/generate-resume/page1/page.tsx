"use client";
import React from "react";
import { useSidebarStore } from "@/stores/sidebarStore";

import P1LeftSide from "@/components/pages/dashboard/generate-reusme/page1/leftside";
import P1RightSide from "@/components/pages/dashboard/generate-reusme/page1/rightside";

const page = () => {
  const { isSideBarOpen } = useSidebarStore();

  return (
    <div
      className={`   ${
        isSideBarOpen
          ? "dashboard-content-sidebar-open"
          : "dashboard-content-sidebar-close"
      }   text-base transition-all duration-150 grid lg:grid-cols-2  flex-1  `}
    >
      <P1LeftSide />
      <P1RightSide />
    </div>
  );
};

export default page;
