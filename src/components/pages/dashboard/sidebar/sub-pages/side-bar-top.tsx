import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/stores/sidebarStore";
import { HomeIcon, PanelRight, PanelRightClose, Router } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const SideBarTop = () => {
  const { isSideBarOpen, setIsSideBarOpen, currentPage } = useSidebarStore();
  const router = useRouter();
  return (
    <>
      <div
        className={` mt-6  min-h-10 text-xl  flex   justify-between items-center px-5`}
      >
        {isSideBarOpen && (
          <Link href="/">
            <div className="  font-semibold">
              <img
                src="/logo/logo-name-light.svg"
                alt=""
                className="  w-20 mix-blend-difference "
              />
            </div>
          </Link>
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
          className={`w-full ${
            isSideBarOpen ? "justify-start" : "justify-center"
          } cursor-pointer`}
          variant={currentPage === "Dashboard" ? "secondary" : "ghost"}
          size="default"
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          <HomeIcon />
          {isSideBarOpen && "Dashboard"}
        </Button>
      </div>
    </>
  );
};

export default SideBarTop;
