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
        isSideBarOpen ? "ml-64 max-sm:ml-0" : "ml-14 max-sm:ml-0"
      } mt-16 p-4   text-base transition-all duration-150 grid lg:grid-cols-2  flex-1 min-h-[calc(100vh-64px)]  `}
    >
      hi
    </div>
  );
};

export default page;
