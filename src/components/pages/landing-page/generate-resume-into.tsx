"use client";
import React from "react";

import InputType from "./landing-page-components/generate-reusme/input-type";
import AnimatedChat from "./landing-page-components/generate-reusme/animated-chat";

import MusicPlayer from "./landing-page-components/generate-reusme/music-player";
import DemoVideo from "./landing-page-components/generate-reusme/demo-video";
import BuiltInEditor from "./landing-page-components/generate-reusme/build-in-editor";
import Security from "./landing-page-components/generate-reusme/security";

const GenerateResumeIntro = () => {
  return (
    <div className="flex justify-center w-full">
      <div className=" min-w-[90vw] max-w-[90vw]  bg-background flex flex-col border-x  w-full">
        <div className=" border-t text-accent  px-3">Generate-resume</div>
        <div className=" border-y grid grid-cols-4 max-sm:grid-cols-1 max-xl:grid-cols-2 shadow-inner h-full  p-1 sm:p-3 gap-1 sm:gap-3 bg-diagonal-grid bg-accent">
          <DemoVideo />
          <div className="grid grid-rows-2 gap-3">
            <InputType />
            <BuiltInEditor />
          </div>
          <div className="grid grid-rows-2 gap-3 ">
            <MusicPlayer />
            <Security />
          </div>
          <div className=" border rounded-lg bg-background shadow-inner overflow-y-auto ">
            <AnimatedChat />
          </div>
        </div>
        <div className=" border-b text-accent  text-right px-3">
          Generate-resume
        </div>
      </div>
    </div>
  );
};

export default GenerateResumeIntro;
