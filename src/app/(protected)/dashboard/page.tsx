"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Plus } from "lucide-react";

import { useSidebarStore } from "@/stores/sidebarStore";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { toast } from "sonner";

type Project = {
  id: string;
  name: string;
  html: string;
  userId: string;
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
      <div className="  h-full   grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5  gap-4 p-4">
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
                      <div className="h-full w-full relative">
                        <img
                          className="h-full w-full"
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
                    </div>
                  </Link>
                  <div className="text-sm text-muted-foreground mt-2">
                    <div className="  truncate ">{project.name} </div>
                  </div>
                </div>
              ))}
          </>
        )}

        <Link href={"/dashboard/generate-resume/page1"}>
          <div className="border-2 border-dashed h-60 w-60 rounded-md cursor-pointer overflow-hidden relative flex justify-center items-center">
            <Plus size={40} className="text-muted-foreground" />{" "}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Create new project
          </div>
        </Link>
      </div>
    </div>
  );
};

export default page;
