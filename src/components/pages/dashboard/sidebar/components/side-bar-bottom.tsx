import { Button } from "@/components/ui/button";
import { useThemeToggle } from "@/components/ui/light-dark";
import { Meteors } from "@/components/ui/meteors";
import { useSidebarStore } from "@/stores/sidebarStore";
import { BellDot, Moon, Settings, Sun, Zap } from "lucide-react";
import React from "react";

const SideBarBottom = () => {
  const { isSideBarOpen } = useSidebarStore();
  const { isDark, toggleTheme } = useThemeToggle();
  return (
    <div className=" mb-3 px-3 w-full   absolute bottom-0  flex flex-col gap-1  ">
      <Button
        className="w-full justify-start "
        variant={"ghost"}
        size={"default"}
      >
        <BellDot /> {isSideBarOpen ? "Notifications" : ""}
      </Button>
      <Button
        className="w-full justify-start "
        variant={"ghost"}
        size={"default"}
      >
        <Settings /> {isSideBarOpen ? "Settings" : ""}
      </Button>
      <Button
        className="w-full justify-start "
        variant={"ghost"}
        size={"default"}
        onClick={() => {
          toggleTheme();
        }}
      >
        {isDark ? <Sun /> : <Moon />}
        {isSideBarOpen ? (isDark ? "Light Mode" : "Dark Mode") : ""}
      </Button>
      <Button
        className=" l_gradient  mt-2   w-full   overflow-hidden border-2 relative  "
        variant={"ghost"}
        size={"default"}
      >
        <Zap /> {isSideBarOpen ? "Upgrade" : ""}
        {isSideBarOpen ? <Meteors number={20} className=" absolute " /> : null}
      </Button>
    </div>
  );
};

export default SideBarBottom;
