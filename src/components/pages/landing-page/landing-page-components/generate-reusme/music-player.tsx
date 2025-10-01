import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { MusicToggleButton } from "@/components/ui/music";
import React from "react";

const MusicPlayer = () => {
  return (
    <div className=" relative border rounded-lg bg-background flex justify-center  max-xl:aspect-square  items-center  overflow-hidden">
      <div className="z-20 flex  justify-center items-center  flex-col gap-2 ">
        <MusicToggleButton className="px-40 py-40" />
        <div>Listen to music</div>
      </div>
      <FlickeringGrid
        className=" absolute   -right-1 -bottom-1 z-0 mask-b-from-80% "
        squareSize={2}
        gridGap={6}
        color="#ffffff"
        maxOpacity={0.5}
        flickerChance={0.1}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/70 z-10"></div>
    </div>
  );
};

export default MusicPlayer;
