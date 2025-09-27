import React from "react";
import {
  ArrowRight,
  Circle,
  Diamond,
  Eraser,
  Hand,
  Image,
  Minus,
  MousePointer2,
  Pen,
  Square,
  Type,
} from "lucide-react";
import { Dock, DockIcon } from "@/components/ui/dock";

const ToolDock = ({ className }: { className: string }) => {
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
  return (
    <div className={`   hide-scrollbar ${className}`}>
      <Dock direction="middle" className="flex h-10 mt-0 rounded-md gap-2">
        {DockIcons.map((icon, index) => (
          <DockIcon
            className=" relative   hover:bg-accent"
            key={index}
            title={icon.label}
            onClick={() => {
              console.log(icon.label);
            }}
          >
            {icon.icon}
            <div className="text-[10px] absolute right-1 bottom-1 text-muted-foreground">
              {icon.index}
            </div>
          </DockIcon>
        ))}
      </Dock>
    </div>
  );
};

export default ToolDock;
