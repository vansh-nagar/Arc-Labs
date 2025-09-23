import React from "react";
import { File, LayoutTemplate, Link, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  IconBrandLinkedinFilled,
  IconManualGearboxFilled,
  IconPdf,
} from "@tabler/icons-react";
import InputType from "../landing-page-components/generate-reusme/input-type";

const GenerateResumeIntro = () => {
  return (
    <div className=" min-w-[90vw] max-w-[90vw]  bg-background flex flex-col border-x  w-full">
      <div className=" border-t text-accent  px-3">Generate-resume</div>
      <div className=" border-y grid grid-cols-4 max-sm:grid-cols-1 max-lg:grid-cols-2 shadow-inner h-full p-3 gap-3 bg-diagonal-grid bg-accent">
        <div className=" border rounded-lg bg-background shadow-inner"></div>
        <div className="grid grid-rows-2 gap-3">
          <InputType />
          <div className=" border rounded-lg bg-background aspect-square "></div>
        </div>
        <div className="grid grid-rows-2 gap-3 ">
          <div className=" border rounded-lg bg-background aspect-square "></div>
          <div className=" border rounded-lg bg-background  aspect-square bg-diagonal-grid shadow-[0_0_8px_rgba(0,0,0,0.2)]"></div>
        </div>
        <div className=" border rounded-lg bg-background shadow-inner"></div>
      </div>
      <div className=" border-b text-accent  text-right px-3">
        Generate-resume
      </div>
    </div>
  );
};

export default GenerateResumeIntro;
