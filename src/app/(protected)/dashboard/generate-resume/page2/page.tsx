"use client";
import React from "react";
import { useSidebarStore } from "@/stores/sidebarStore";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const page = () => {
  const { isSideBarOpen } = useSidebarStore();
  return (
    <div
      className={` h-[calc(100vh-64px)] ${
        isSideBarOpen
          ? "dashboard-content-sidebar-open"
          : "dashboard-content-sidebar-close"
      }`}
    >
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel
          defaultSize={25}
          className="h-full rounded-2xl border  mr-4"
        >
          One
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={75}
          className="h-full ml-4 border rounded-2xl"
        >
          Two
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default page;
