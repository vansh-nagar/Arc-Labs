import {
  IconBrandLinkedinFilled,
  IconManualGearboxFilled,
  IconPdf,
} from "@tabler/icons-react";
import { LayoutTemplate, Zap } from "lucide-react";
import React from "react";

const InputType = () => {
  return (
    <div className=" group border rounded-lg aspect-square bg-background bg-diagonal-grid  shadow-[0_0_8px_rgba(0,0,0,0.2)] flex flex-col justify-center relative items-center gap-2 overflow-hidden  ">
      <div className="bg-radial  to-background to-60% absolute inset-0 " />
      <div className="h-16 w-16  border rounded-2xl  flex justify-center items-center bg-background">
        <IconPdf />
      </div>
      <div className=" flex gap-2">
        {" "}
        <div className="h-16 w-16  border rounded-2xl  flex justify-center items-center bg-background">
          <IconManualGearboxFilled />
        </div>
        <div className="h-16 w-16  border rounded-2xl flex justify-center items-center bg-background shadow-[0_0_20px_rgba(0,0,0,0.2)] animate-pulse  dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]  ">
          <Zap />
        </div>
        <div className="h-16 w-16  border rounded-2xl  flex justify-center items-center bg-background">
          <LayoutTemplate />
        </div>
      </div>
      <div className="h-16 w-16  border rounded-2xl  flex justify-center items-center bg-background">
        <IconBrandLinkedinFilled />
      </div>
      <div className="z-10  text-shadow-2xs absolute bottom-3 ">
        Build Your Resume Your Way
      </div>
    </div>
  );
};

export default InputType;
