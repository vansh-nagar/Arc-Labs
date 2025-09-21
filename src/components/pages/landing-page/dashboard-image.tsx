"use client";
import { useTheme } from "next-themes";
import React from "react";

const DashboardImage = () => {
  const { theme } = useTheme();

  return (
    <div className=" h-screen  border-x bg-background min-w-[90vw]  max-w-[90vw]  flex flex-col   ">
      <div className=" border-t text-accent  px-3 ">Dashboard</div>
      <div className="p-3 bg-accent bg-diagonal-grid shadow-inner">
        {theme === "light" ? (
          <img
            src="https://pbs.twimg.com/media/G0FOCcpXgAArDLT?format=jpg&name=large"
            alt=""
            className=" rounded-lg  "
          />
        ) : (
          <img
            src="https://pbs.twimg.com/media/G0FN-smWUAAXYLf?format=jpg&name=large"
            alt=""
            className=" rounded-lg"
          />
        )}
      </div>

      <div className=" border-b text-accent  px-3 text-right"> Dashboard</div>
    </div>
  );
};

export default DashboardImage;
