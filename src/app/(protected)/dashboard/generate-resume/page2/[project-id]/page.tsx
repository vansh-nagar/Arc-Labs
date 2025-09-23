"use client";

import ResizablePanel1 from "@/components/pages/dashboard/generate-reusme/page2/resizable-panel1";
import ResizablePanel2 from "@/components/pages/dashboard/generate-reusme/page2/resizable-panel2";
import { useSidebarStore } from "@/stores/sidebarStore";

import React, { useRef } from "react";

import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface PageProps {
  params: {
    "project-id": string;
  };
}

const page = ({ params }: PageProps) => {
  const { isSideBarOpen } = useSidebarStore();

  const resolvedParams: { "project-id": string } = React.use(params as any);
  const originalProjectId = useRef(resolvedParams["project-id"]);

  return (
    <div
      className={` h-[calc(100vh-64px)] ${
        isSideBarOpen
          ? "dashboard-content-sidebar-open"
          : "dashboard-content-sidebar-close"
      }`}
    >
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full relative"
      >
        <ResizablePanel1 />
        <ResizableHandle withHandle />
        <ResizablePanel2
          originalProjectId={originalProjectId}
          resolvedParams={resolvedParams}
        />
      </ResizablePanelGroup>
    </div>
  );
};

export default page;
