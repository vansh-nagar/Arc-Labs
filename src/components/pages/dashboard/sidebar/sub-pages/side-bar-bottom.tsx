import { Button } from "@/components/ui/button";
import { useThemeToggle } from "@/components/ui/light-dark";
import { Meteors } from "@/components/ui/meteors";
import { ShineBorder } from "@/components/ui/shine-border";
import { useSidebarStore } from "@/stores/sidebarStore";
import { BellDot, Moon, Sun, Zap } from "lucide-react";
import React from "react";

const sidebarPages = [
  {
    label: "Notifications",
    icon: <BellDot />,
    path: "/dashboard/generate-resume/page1",
  },
];

const SideBarBottom = () => {
  const { isSideBarOpen } = useSidebarStore();
  const { isDark, toggleTheme } = useThemeToggle();
  return (
    <div className=" mb-3 px-3 w-full   absolute bottom-0  flex flex-col gap-1  ">
      <Button
        className={`w-full ${
          isSideBarOpen ? "justify-start" : "justify-center"
        } cursor-pointer`}
        variant={"ghost"}
        size={"default"}
        onClick={() => {
          toggleTheme();
        }}
      >
        {isDark ? <Sun /> : <Moon />}
        {isSideBarOpen ? (isDark ? "Light Mode" : "Dark Mode") : ""}
      </Button>
      {sidebarPages.map((page) => (
        <Button
          key={page.label}
          className={`w-full ${
            isSideBarOpen ? "justify-start" : "justify-center"
          } cursor-pointer`}
          variant={"ghost"}
          size={"default"}
        >
          {page.icon} {isSideBarOpen ? page.label : ""}
        </Button>
      ))}

      <Button
        className=" l_gradient  mt-2   w-full   overflow-hidden  relative cursor-pointer   "
        variant={"ghost"}
        size={"default"}
      >
        <ShineBorder shineColor={["#ffffff", "#000000"]} borderWidth={2} />
        <Zap /> {isSideBarOpen ? "Upgrade" : ""}
        {isSideBarOpen ? <Meteors number={30} className=" absolute " /> : null}
      </Button>
    </div>
  );
};

export default SideBarBottom;
