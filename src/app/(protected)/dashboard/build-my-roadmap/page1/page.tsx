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
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ToolDock from "@/components/pages/dashboard/build-my-roadmap/dock";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const page = () => {
  const { isSideBarOpen } = useSidebarStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");

    let isDrawing = false;

    const draw = (dpr: number) => {
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, c.width, c.height);

      ctx.scale(dpr, dpr);
      ctx.fillStyle = "blue";
      ctx.strokeStyle = theme === "dark" ? "white" : "black";

      ctx.stroke();
    };

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      draw(dpr);
    };

    const startDrawing = (e: MouseEvent) => {
      if (!ctx) return;
      isDrawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    };

    const drawLine = (e: MouseEvent) => {
      if (!ctx || !isDrawing) return;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = theme === "dark" ? "white" : "black";
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    };

    const stopDrawing = () => {
      isDrawing = false;
      if (ctx) ctx.beginPath();
    };

    window.addEventListener("resize", handleResize);
    c.addEventListener("mousedown", startDrawing);
    c.addEventListener("mousemove", drawLine);
    c.addEventListener("mouseup", stopDrawing);
    c.addEventListener("mouseleave", stopDrawing);

    handleResize(); // initial draw

    return () => {
      window.removeEventListener("resize", handleResize);
      c.removeEventListener("mousedown", startDrawing);
      c.removeEventListener("mousemove", drawLine);
      c.removeEventListener("mouseup", stopDrawing);
      c.removeEventListener("mouseleave", stopDrawing);
    };
  }, [theme]);

  return (
    <div
      className={`${
        isSideBarOpen
          ? "dashboard-content-sidebar-open"
          : "dashboard-content-sidebar-close"
      }    relative`}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className=" absolute top-6 left-6 z-40 ">
            <Button variant={"secondary"} size={"icon"}>
              <Menu />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className=" absolute right-6 top-6 z-40 flex justify-center items-center gap-2">
        <Button size={"icon"}>
          <Lock />
        </Button>
        <Button className=" bg-[#484aaa] text-white">Share</Button>
      </div>

      <div className="absolute bottom-6 right-1/2 translate-x-1/2 z-40  max-lg:hidden ">
        <ToolDock className="" />
      </div>

      <div className="z-40  overflow-hidden absolute bottom-6 left-6">
        <Button
          variant={"secondary"}
          size={"icon"}
          className="relative overflow-hidden  "
        >
          <Sparkles />
          <ShineBorder shineColor={["#000000", "#ffffff"]} />
        </Button>
      </div>

      <div className=" flex flex-col  items-end   gap-2 absolute bottom-6   right-6 z-40">
        <Drawer>
          <DrawerTrigger asChild>
            <Button size={"icon"} className=" md:hidden">
              <ToolCaseIcon />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-xl font-bold">Toolkit</DrawerTitle>{" "}
              <DrawerDescription className="text-sm text-muted-foreground">
                Select a tool from the palette below to begin creating your
                custom roadmap
              </DrawerDescription>{" "}
              <DrawerClose className="mt-6">
                <ToolDock className="mask-r-from-90% mask-l-from-90% overflow-y-auto " />
              </DrawerClose>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
        <ToggleGroup
          type="single"
          className="  border  h-10 text-xs  overflow-hidden"
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
          className=" border h-10  text-xs  overflow-hidden"
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
        <ToolDock className=" max-md:hidden  lg:hidden" />
      </div>

      <canvas
        ref={canvasRef}
        className="h-[calc(100vh-88px)] w-full  border rounded-xl relative"
      ></canvas>
    </div>
  );
};

export default page;
