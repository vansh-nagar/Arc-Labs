"use client";
import React from "react";
import { useSidebarStore } from "@/stores/sidebarStore";

const page = () => {
  const { isSideBarOpen } = useSidebarStore();

  return (
    <div
      className={`  ${
        isSideBarOpen
          ? "dashboard-content-sidebar-open"
          : "dashboard-content-sidebar-close"
      } `}
    >
      <div>Projects</div>
    </div>
  );
};

export default page;
