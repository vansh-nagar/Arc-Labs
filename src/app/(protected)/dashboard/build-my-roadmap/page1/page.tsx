"use client";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Pointer } from "@/components/ui/pointer";
import { ShineBorder } from "@/components/ui/shine-border";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSidebarStore } from "@/stores/sidebarStore";
import {
  Lock,
  Menu,
  Minus,
  Plus,
  Redo,
  Sparkles,
  ToolCaseIcon,
  Undo,
} from "lucide-react";
import React, { useEffect, useRef } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ToolDock from "@/components/pages/dashboard/build-my-roadmap/dock";

const page = () => {
  const { isSideBarOpen } = useSidebarStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");

    const draw = (dpr: number) => {
      if (!ctx) return;
      // reset transform & clear canvas
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, c.width, c.height);

      ctx.scale(dpr, dpr);
      ctx.fillStyle = "blue";
      ctx.strokeStyle = "white";

      ctx.beginPath();
      ctx.arc(140, 300, 100, 0, Math.PI * 2);
      ctx.stroke();
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      draw(dpr);
    };

    window.addEventListener("resize", handleResize);

    // initial size + draw
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`${
        isSideBarOpen
          ? "dashboard-content-sidebar-open"
          : "dashboard-content-sidebar-close"
      }    relative   cursor-none cursor-hidden   `}
    >
      <SmoothCursor />
      <div className=" absolute top-6 left-6 z-40 ">
        <Button variant={"secondary"} size={"icon"}>
          <Menu />
        </Button>
      </div>

      <div className=" absolute right-6 top-6 z-40 flex justify-center items-center gap-3">
        <Button size={"icon"}>
          <Lock />
        </Button>
        <Button className=" bg-[#484aaa] text-white">Share</Button>
      </div>

      <Drawer>
        <DrawerTrigger
          className=" absolute bottom-6 right-1/2 translate-x-1/2 z-40"
          asChild
        >
          <Button size={"icon"} className="h-10 w-10">
            <ToolCaseIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Select any</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter>
            <ToolDock />
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <ToolDock />

      <div className="z-40  overflow-hidden absolute bottom-6 left-6">
        <Button
          variant={"secondary"}
          size={"icon"}
          className="relative overflow-hidden h-10 w-10 "
        >
          <Sparkles />
          <ShineBorder shineColor={["#000000", "#ffffff"]} />
        </Button>
      </div>

      <div className=" flex flex-col  items-end   gap-3 absolute bottom-6   right-6">
        <ToggleGroup
          type="single"
          className="  border h-10  text-xs z-40 overflow-hidden"
        >
          <Button
            size={"icon"}
            variant={"ghost"}
            className=" h-full rounded-none"
          >
            <Undo className=" " size={14} />
          </Button>
          <Button
            size={"icon"}
            variant={"ghost"}
            className=" h-full rounded-none"
          >
            <Redo className="" size={14} />
          </Button>
        </ToggleGroup>
        <ToggleGroup
          type="single"
          className=" border h-10  text-xs z-40 overflow-hidden"
        >
          <Button
            size={"icon"}
            variant={"ghost"}
            className="mr-6 h-full rounded-none"
          >
            <Plus className=" " size={14} />
          </Button>
          <div>12%</div>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="ml-6 h-full rounded-none"
          >
            <Minus className="" size={14} />
          </Button>
        </ToggleGroup>
      </div>

      <canvas
        ref={canvasRef}
        className="h-[calc(100vh-88px)] w-full  border rounded-xl relative"
      ></canvas>
    </div>
  );
};

export default page;
