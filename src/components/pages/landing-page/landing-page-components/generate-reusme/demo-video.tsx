import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import React from "react";

const DemoVideo = () => {
  return (
    <div className=" relative border  rounded-lg bg-background  overflow-hidden shadow-inner flex">
      <HeroVideoDialog
        className="  grow w-full  h-[600px] block "
        animationStyle="from-left"
        videoSrc="https://www.youtube.com/embed/SPn_8dIT7_Q?si=sHSunESgdJ1lF7yv"
        thumbnailSrc="https://ik.imagekit.io/ijuiklevk/image.png"
        thumbnailAlt="Hero Video"
      />
    </div>
  );
};

export default DemoVideo;
