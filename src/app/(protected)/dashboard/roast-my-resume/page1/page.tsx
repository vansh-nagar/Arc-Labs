"use client";
import { useSidebarStore } from "@/stores/sidebarStore";
import React from "react";

const page = () => {
  const { isSideBarOpen } = useSidebarStore();
  return (
    <div
      className={`${
        isSideBarOpen
          ? "dashboard-content-sidebar-open"
          : "dashboard-content-sidebar-close"
      }`}
    >
      page
    </div>
  );
};

export default page;
