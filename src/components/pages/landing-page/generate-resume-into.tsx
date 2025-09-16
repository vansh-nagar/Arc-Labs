import React from "react";
import { File, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

const GenerateResumeIntro = () => {
  return (
    <div className=" min-w-[90vw] max-w-[90vw] h-[80vh] bg-background flex flex-col border-x  w-full">
      <div className=" border-t text-accent  px-3">Generate-resume</div>
      <div className=" border-y grid grid-cols-4 max-sm:grid-cols-1 max-lg:grid-cols-2 shadow-inner h-full p-3 gap-3 bg-diagonal-grid bg-accent">
        <div className=" border rounded-lg bg-background shadow-inner"></div>
        <div className="grid grid-rows-2 gap-3">
          <div className=" border rounded-lg bg-background bg-diagonal-grid shadow-md "></div>
          <div className=" border rounded-lg bg-background"></div>
        </div>
        <div className="grid grid-rows-2 gap-3">
          <div className=" border rounded-lg bg-background"></div>
          <div className=" border rounded-lg bg-background  bg-diagonal-grid shadow-md"></div>
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
