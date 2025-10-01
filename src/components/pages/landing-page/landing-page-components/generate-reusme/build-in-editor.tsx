import { Code, Minus, Plus, RotateCw } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const settingButtons = [
  {
    icon: <Plus />,
    title: "Increase Font Size",
  },
  {
    icon: <Minus />,
    title: "Decrease Font Size",
  },
  {
    icon: <RotateCw />,
    title: "Reset to defaults",
  },
];

const BuiltInEditor = () => {
  return (
    <div className=" relative border rounded-lg  overflow-hidden bg-background p-2 ">
      <div className="h-52 w-4  blur-[35px] absolute top-0 left-16 bg-accent-foreground -rotate-[28deg]  "></div>
      <Code
        className="  text-muted  absolute bottom-1/2 translate-y-1/2 right-1/2 translate-x-1/2 "
        size={130}
      />
      <div className="text-2xl md:text-3xl font-semibold ">
        Built-In HTML & CSS Editor for Developers
      </div>
      <div className=" flex flex-col gap-2 absolute bottom-2 left-2">
        {settingButtons.map((button, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button size={"icon"} variant={"outline"}>
                {button.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{button.title}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className=" absolute  bottom-0 -right-1/2 w-72 border p-1 rounded-sm overflow-hidden">
        {" "}
        <img
          src={"https://ik.imagekit.io/ijuiklevk/image.png"}
          alt=""
          className="  rounded-xs "
        />
        <div className=" h-10 w-10 absolute top-0 left-0 bg-accent-foreground blur-[60px]"></div>
      </div>
    </div>
  );
};

export default BuiltInEditor;
