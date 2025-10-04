"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import useSound from "use-sound";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MusicToggleButtonProps {
  className?: string;
}

export const MusicToggleButton: React.FC<MusicToggleButtonProps> = ({
  className,
}) => {
  const bars = 10;

  const getRandomHeights = () =>
    Array.from({ length: bars }, () => Math.random() * 0.8 + 0.2);

  const tracks = [
    { src: "/music/silk&colegne.mp3", name: "Silk & Cologne" },
    { src: "/music/linkUp.mp3", name: "Link Up" },
    { src: "/music/home.mp3", name: "Home" },
    { src: "/music/selfLove.mp3", name: "Self Love" },
  ];

  const [heights, setHeights] = useState(getRandomHeights());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const [play, { pause, sound }] = useSound(tracks[currentTrackIndex].src, {
    loop: true,
    onplay: () => setIsPlaying(true),
    onpause: () => setIsPlaying(false),
    onstop: () => setIsPlaying(false),
    soundEnabled: true,
  });

  // Waveform animation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => setHeights(getRandomHeights()), 100);
      return () => clearInterval(interval);
    }
    setHeights(Array(bars).fill(0.1));
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (isPlaying) pause();
    else play();
  };

  const handleNextTrack = () => {
    pause();
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
  };

  const handlePrevTrack = () => {
    pause();
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
  };

  return (
    <div className={`flex flex-col items-center  justify-center ${className}`}>
      <div className="flex items-center gap-1">
        {/* Previous Track */}
        <button
          onClick={handlePrevTrack}
          className="p-2 bg-background rounded-full border cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Waveform / Play-Pause */}
        <motion.div
          onClick={handlePlayPause}
          key="audio"
          initial={{ padding: "6px 8px" }}
          whileHover={{ padding: "8px 10px" }}
          whileTap={{ padding: "10px 12px" }}
          transition={{ duration: 0.3, bounce: 0.4, type: "spring" }}
          className="bg-background cursor-pointer rounded-full border flex items-center"
        >
          <motion.div
            initial={{ opacity: 0, filter: "blur(2px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(2px)" }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="flex w-[60px] h-5 justify-center items-center gap-[1px] relative"
          >
            {heights.map((height, index) => (
              <motion.div
                key={index}
                className="bg-foreground w-[2px] rounded-full"
                initial={{ height: 1 }}
                animate={{ height: Math.max(3, height * 15) }}
                transition={{ type: "spring", stiffness: 500, damping: 12 }}
              />
            ))}
            <div
              about=""
              className="text-[6px] font-medium  absolute mix-blend-difference text-muted-foreground text-nowrap right-1/2 -bottom-4 translate-x-1/2"
            >
              {tracks[currentTrackIndex].name}
            </div>
          </motion.div>
        </motion.div>

        {/* Next Track */}
        <button
          onClick={handleNextTrack}
          className="p-2 bg-background rounded-full border cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Track Name */}
    </div>
  );
};
