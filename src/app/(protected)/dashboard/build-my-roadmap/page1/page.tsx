"use client";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Pointer } from "@/components/ui/pointer";
import { ShineBorder } from "@/components/ui/shine-border";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSidebarStore } from "@/stores/sidebarStore";
import {
  ArrowRight,
  Circle,
  Diamond,
  Eraser,
  Hand,
  Image,
  Lock,
  Menu,
  Minus,
  MousePointer2,
  Pen,
  Plus,
  Redo,
  Sparkle,
  Sparkles,
  Square,
  Type,
  Undo,
} from "lucide-react";
import React, { useEffect, useRef } from "react";

const DockIcons = [
  {
    icon: <Hand size={14} />,
    label: "Hand",
    index: 0,
  },
  {
    icon: <MousePointer2 size={14} />,
    label: "Pointer",
    index: 1,
  },
  {
    icon: <Square size={14} />,
    label: "Square",
    index: 2,
  },
  {
    icon: <Diamond size={14} />,
    label: "Diamond",
    index: 3,
  },
  {
    icon: <Circle size={14} />,
    label: "Circle",
    index: 4,
  },
  {
    icon: <ArrowRight size={14} />,
    label: "Arrow",
    index: 5,
  },
  {
    icon: <Minus size={14} />,
    label: "Line",
    index: 6,
  },
  {
    icon: <Pen size={14} />,
    label: "Pen",
    index: 7,
  },
  {
    icon: <Type size={14} />,
    label: "Text",
    index: 8,
  },
  {
    icon: <Image size={14} />,
    label: "Image",
    index: 9,
  },
  {
    icon: <Eraser size={14} />,
    label: "Eraser",
    index: 0,
  },
];

const page = () => {
  const { isSideBarOpen } = useSidebarStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const ctx = c.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();

    c.width = rect.width * dpr;
    c.height = rect.height * dpr;

    if (ctx) {
      ctx.scale(dpr, dpr);

      ctx.fillStyle = "blue";

      ctx.strokeStyle = "white";
      // ctx.fillRect(0, 0, 10, 10);

      ctx.beginPath();

      ctx.arc(150, 300, 100, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, []);

  return (
    <div
      className={`${
        isSideBarOpen
          ? "dashboard-content-sidebar-open"
          : "dashboard-content-sidebar-close"
      }    relative `}
    >
      <Dock
        direction="middle"
        className="  absolute bottom-6 right-1/2 translate-x-1/2 z-50 h-11 rounded-md gap-2"
      >
        {DockIcons.map((icon, index) => (
          <DockIcon
            className=" relative   hover:bg-accent"
            key={index}
            title={icon.label}
          >
            {icon.icon}
            <div className="text-[10px] absolute right-1 bottom-1 text-muted-foreground">
              {icon.index}
            </div>
          </DockIcon>
        ))}
      </Dock>

      <div className="absolute left-6 bottom-6 flex  gap-3">
        <ToggleGroup
          type="single"
          className=" border h-10  text-xs z-50 overflow-hidden"
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
        <ToggleGroup
          type="single"
          className="  border h-10  text-xs z-50 overflow-hidden"
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
      </div>

      <div className=" absolute top-6 left-6 z-50 ">
        <Button variant={"secondary"} size={"icon"}>
          <Menu />
        </Button>
      </div>

      <div className=" absolute right-6 top-6 z-50 flex justify-center items-center gap-3">
        <Button size={"icon"}>
          <Lock />
        </Button>
        <Button className=" bg-[#484aaa] text-white">Share</Button>
      </div>

      <div className="z-50 absolute right-6 bottom-6 overflow-hidden">
        <Button
          variant={"secondary"}
          size={"icon"}
          className="relative overflow-hidden "
        >
          <Sparkles />
          <ShineBorder shineColor={["#000000", "#ffffff"]} />
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        className="h-[calc(100vh-88px)] w-full  border rounded-xl relative"
      ></canvas>
    </div>
  );
};

export default page;
