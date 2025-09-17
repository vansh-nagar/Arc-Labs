"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const HeroSection = () => {
  const router = useRouter();

  return (
    <div className=" h-[70vh] w-full flex  justify-center items-center pt-[60px]   ">
      <div className=" relative w-full max-w-[90vw]  flex justify-center items-center flex-col  bg-background    h-full  text-center  border-x  overflow-hidden    ">
        <div className="bg-diagonal-grid  h-10 border-t w-full"></div>
        <div className=" font-semibold text-4xl bg-background border-y  w-full sm:text-6xl md:text-8xl  text-transparent dark:text-background line-text  ">
          ARC LABS
        </div>
        <div className="bg-diagonal-grid  h-4  w-full"></div>
        <div className=" bg-background  leading-5  text-xs sm:text-base border-y w-full ">
          Land your dream job with AI-powered tools for resumes, interviews, and
          more....
        </div>
        <div className="bg-diagonal-grid  h-4  w-full border-b"></div>

        <div className="  max-sm:gap-4 flex bg-background   gap-10 mt-11 border-y w-full   justify-center dark:bg-[repeating-linear-gradient(135deg,#1a1a1a_0px,#1a1a1a_1px,transparent_1px,transparent_8px)] bg-[repeating-linear-gradient(135deg,#e5e5e5_0px,#e5e5e5_1px,transparent_1px,transparent_8px)]">
          <Button
            asChild
            className="border-accent max-sm:px-6 bg-indigo-500 text-white px-12  rounded-none"
          >
            <Link href="/dashboard">Get started</Link>
          </Button>

          <Button className="   border-x px-12 max-sm:px-6  bg-background rounded-none">
            {" "}
            Learn more
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
