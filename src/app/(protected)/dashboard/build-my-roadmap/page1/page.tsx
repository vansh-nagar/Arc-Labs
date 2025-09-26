"use client";
import { Pointer } from "@/components/ui/pointer";
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
      <Pointer />
      page
    </div>
  );
};

export default page;
