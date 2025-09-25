import { LockIcon } from "lucide-react";
import React from "react";

const Lock = () => {
  return (
    <div className=" absolute flex flex-col gap-3  bg-radial to-background   bg-white/40 backdrop-blur-md z-50 inset-0  justify-center items-center rounded-md">
      <LockIcon size={30} className=" mix-blend-difference" />
      <p className="text-sm text-gray-500">This project is locked.</p>
    </div>
  );
};

export default Lock;
