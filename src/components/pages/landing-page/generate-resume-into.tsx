import React from "react";
import { File, LayoutTemplate, Link, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  IconBrandLinkedinFilled,
  IconManualGearboxFilled,
  IconPdf,
} from "@tabler/icons-react";

const GenerateResumeIntro = () => {
  return (
    <div className=" min-w-[90vw] max-w-[90vw]  bg-background flex flex-col border-x  w-full">
      <div className=" border-t text-accent  px-3">Generate-resume</div>
      <div className=" border-y grid grid-cols-4 max-sm:grid-cols-1 max-lg:grid-cols-2 shadow-inner h-full p-3 gap-3 bg-diagonal-grid bg-accent">
        <div className=" border rounded-lg bg-background shadow-inner"></div>
        <div className="grid grid-rows-2 gap-3">
          <div className=" border rounded-lg aspect-square bg-background bg-diagonal-grid  shadow-[0_0_8px_rgba(0,0,0,0.2)] flex flex-col justify-center relative items-center gap-2 overflow-hidden  ">
            {" "}
            <div className="bg-radial  to-background to-60% absolute inset-0 " />
            <div className="h-16 w-16  border rounded-2xl  flex justify-center items-center bg-background">
              <IconPdf />
            </div>
            <div className=" flex gap-2">
              {" "}
              <div className="h-16 w-16  border rounded-2xl  flex justify-center items-center bg-background">
                <IconManualGearboxFilled />
              </div>
              <div className="h-16 w-16 border rounded-2xl flex justify-center items-center bg-background shadow-[0_0_20px_rgba(0,0,0,0.2)] animate-pulse  dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]  ">
                <Zap />
              </div>
              <div className="h-16 w-16  border rounded-2xl  flex justify-center items-center bg-background">
                <LayoutTemplate />
              </div>
            </div>
            <div className="h-16 w-16  border rounded-2xl  flex justify-center items-center bg-background">
              <IconBrandLinkedinFilled />
            </div>
            <div className="z-10  dark:mask-b-from-0% text-shadow-2xs absolute bottom-3 ">
              Build Your Resume Your Way
            </div>
          </div>
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
