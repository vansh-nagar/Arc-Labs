"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Ellipsis,
  Eye,
  LinkIcon,
  LockIcon,
  Plus,
  UnlockIcon,
} from "lucide-react";

import { useSidebarStore } from "@/stores/sidebarStore";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { toast } from "sonner";
import {
  PopoverContent,
  PopoverTrigger,
  Popover,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/shadcn-io/dropzone";

type Project = {
  id: string;
  name: string;
  html: string;
  locked: boolean;
  viewCount: number;
  userId: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

const page = () => {
  const { isSideBarOpen } = useSidebarStore();
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();
  const calledGetProjects = useRef(false);
  const [showSkeletonLoading, setShowSkeletonLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    if (calledGetProjects.current) return;
    calledGetProjects.current = true;
    toast.loading("Fetching your projects...");

    const email = session?.user?.email;
    axios
      .post("/api/dashboard/get-user-projects", { email })
      .then((res) => {
        setProjects(res.data.projects || []);
        toast.dismiss();
        toast.success(res.data.message || "Projects loaded successfully");
      })
      .catch((err) => {
        toast.dismiss();
        toast.error(err.response?.data?.error || "Something went wrong");
      })
      .finally(() => {
        calledGetProjects.current = false;
        setShowSkeletonLoading(false);
      });
  }, [status]);

  return (
    <div
      className={`  ${
        isSideBarOpen
          ? "dashboard-content-sidebar-open"
          : "dashboard-content-sidebar-close"
      }  flex  justify-center`}
    >
      <div className="  h-full   grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-4 p-4">
        {showSkeletonLoading ? (
          <>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="h-60 w-60" />
                <Skeleton className="h-5 w-60" />
              </div>
            ))}
          </>
        ) : (
          <>
            {projects.length > 0 &&
              projects.map((project) => (
                <div key={project.id} className="flex flex-col   ">
                  <Link href={`/dashboard/generate-resume/page2/${project.id}`}>
                    <div className=" h-60 w-60 shadow rounded-md cursor-pointer overflow-hidden relative">
                      <div className="h-full w-full relative z-10">
                        <img
                          className="h-full w-full "
                          src="https://i.pinimg.com/originals/8e/6f/64/8e6f64217df3d96711e200bf1432fceb.gif"
                          style={{
                            filter: `hue-rotate(${Math.floor(
                              Math.random() * 360
                            )}deg) 
                               contrast(${0.8 + Math.random() * 0.4}) 
                               brightness(${0.8 + Math.random() * 0.4}) 
                               saturate(${0.8 + Math.random() * 0.8})`,
                          }}
                        />
                      </div>
                      <div className=" absolute top-3 right-3 flex flex-row gap-2 z-30">
                        <Button
                          variant={`${project.locked ? "default" : "outline"}`}
                          size="icon"
                        >
                          {project.locked ? <LockIcon /> : <UnlockIcon />}
                        </Button>
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Link copied to clipboard");
                          }}
                          variant="outline"
                          size="icon"
                        >
                          <LinkIcon />
                        </Button>
                        <Button variant="outline" className=" cursor-pointer">
                          <Eye /> <div>{project.viewCount}</div>
                        </Button>
                      </div>
                    </div>
                  </Link>
                  <div className="text-sm text-muted-foreground mt-2 flex justify-between items-center">
                    <div className="  truncate  max-w-44">{project.name} </div>
                    <Popover>
                      <PopoverTrigger>
                        <Ellipsis className=" cursor-pointer" />
                      </PopoverTrigger>
                      <PopoverContent className="p-0 overflow-hidden">
                        <Dialog>
                          <DialogTrigger asChild className="w-full">
                            <Button
                              size={"sm"}
                              variant={"ghost"}
                              className=" w-full rounded-none"
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="p-3  ">
                            <DialogHeader>
                              <DialogTitle className="mt-2">
                                Edit Project
                              </DialogTitle>
                              <DialogDescription className=" flex flex-col gap-2 mt-2 w-full">
                                <Dropzone
                                  maxFiles={1}
                                  onDrop={(e: any) => {
                                    console.log(e);
                                  }}
                                  onError={console.error}
                                >
                                  <DropzoneEmptyState />
                                  <DropzoneContent />
                                </Dropzone>
                                <Input
                                  value={project.name}
                                  placeholder="Project Name"
                                />
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size={"sm"}
                          variant={"ghost"}
                          className=" w-full rounded-none"
                        >
                          Delete
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              ))}
          </>
        )}

        <Link href={"/dashboard/generate-resume/page1"}>
          <div className="border-2 border-dashed h-60 w-60 rounded-md cursor-pointer overflow-hidden relative flex flex-col gap-2 justify-center items-center">
            <Plus size={40} className="text-muted-foreground" />{" "}
            <div className="text-sm text-muted-foreground mt-2">
              Create new project
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default page;
