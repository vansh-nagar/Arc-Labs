import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/stores/sidebarStore";
import { HomeIcon, PanelRight, PanelRightClose } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

const SideBarTop = () => {
  const { isSideBarOpen, setIsSideBarOpen } = useSidebarStore();
  return (
    <>
      <div
        className={` mt-6  min-h-10 text-xl  flex   justify-between items-center px-5`}
      >
        {isSideBarOpen && (
          <div className="  font-semibold">
            <img
              src="/arc-white.svg"
              alt=""
              className="  w-20 mix-blend-difference "
            />
          </div>
        )}
        {isSideBarOpen ? (
          <PanelRight
            size={15}
            className=" cursor-pointer text-neutral-500 "
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          />
        ) : (
          <PanelRightClose
            size={15}
            className=" cursor-pointer  "
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          />
        )}
      </div>
      <div className="mt-5 px-3">
        <Button
          className={`w-full  ${
            isSideBarOpen ? "justify-start" : " justify-center"
          } `}
          variant={"ghost"}
          size={"default"}
        >
          <Link
            href={"/dashboard"}
            className=" flex justify-center items-center gap-2"
          >
            <HomeIcon /> {isSideBarOpen ? "Dashboard" : ""}
          </Link>
        </Button>
      </div>
    </>
  );
};

export default SideBarTop;
