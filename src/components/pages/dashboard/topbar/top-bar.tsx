"use client";
import React, { useEffect, useState } from "react";
import { useSidebarStore } from "@/stores/sidebarStore";
import { Edit, LogOut, PanelRight, PanelRightClose } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { MusicToggleButton } from "@/components/ui/music";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Top_bar = () => {
  const { data: session, status } = useSession();
  const { isSideBarOpen, setIsSideBarOpen, currentPage } = useSidebarStore();

  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(
    "https://i.pinimg.com/736x/f6/2c/67/f62c675e9a6ee4465be8f9a68dd70b4f.jpg"
  );

  useEffect(() => {
    if (status === "authenticated" && session?.user?.image) {
      setImage(session?.user?.image);
      setLoading(false);
    }
  }, [status]);

  return (
    <div
      className={`  h-16 fixed top-0  right-0   bg-background z-40  ${
        isSideBarOpen ? "left-64 max-sm:left-0" : "left-16 max-sm:left-0 "
      } px-4 flex border-b border-dashed items-center  justify-between bg-background  transition-all duration-150`}
    >
      <h1 className="font-medium text-lg max-sm:hidden ">{currentPage}</h1>

      <div className="  sm:hidden">
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

      <div className=" flex gap-2">
        <MusicToggleButton />

        <DropdownMenu>
          <DropdownMenuTrigger>
            {" "}
            {loading ? (
              <Skeleton className="w-10 aspect-square rounded-full" />
            ) : (
              <Image
                src={image}
                alt="User Avatar"
                width={736} // put the real width
                height={1104} // put the real height
                className=" w-10 aspect-square  rounded-full hover:scale-105 transition-all duration-150  cursor-pointer  "
              />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Edit /> Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                signOut({ callbackUrl: "/" });
              }}
            >
              <LogOut /> Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Top_bar;
