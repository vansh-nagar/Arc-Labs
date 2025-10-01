import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import {
  IconBrandLinkedinFilled,
  IconManualGearboxFilled,
  IconPdf,
} from "@tabler/icons-react";
import { LayoutTemplate, Zap } from "lucide-react";
import React from "react";

const InputType = () => {
  return (
    <div className=" group border rounded-lg max-xl:aspect-square bg-background bg-diagonal-grid  shadow-[0_0_8px_rgba(0,0,0,0.2)] flex flex-col justify-center relative items-center gap-2 overflow-hidden  ">
      <div className="bg-radial  to-background to-70% absolute inset-0 " />

      <div className=" flex gap-2">
        {" "}
        <div
          style={{
            animation: "pulse 4s linear infinite",
          }}
          className="h-16 w-16   border rounded-2xl flex justify-center items-center bg-background shadow-[0_0_20px_rgba(0,0,0,0.2)]   dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]  "
        >
          <Zap />
        </div>
      </div>

      <OrbitingCircles radius={80}>
        <IconBrandLinkedinFilled />
        <LayoutTemplate />
        <IconManualGearboxFilled />
        <IconPdf />
      </OrbitingCircles>
      <OrbitingCircles reverse radius={140}>
        <IconBrandLinkedinFilled size={90} />
        <LayoutTemplate size={90} />
        <IconManualGearboxFilled size={90} />
        <IconPdf size={90} />
      </OrbitingCircles>
    </div>
  );
};

export default InputType;
