"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Plus } from "lucide-react";

import { useSidebarStore } from "@/stores/sidebarStore";
import { Skeleton } from "@/components/ui/skeleton";

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

  useEffect(() => {
    if (status !== "authenticated") return;

    const email = session?.user?.email;
    axios.post("/api/dashboard/get-user-projects", { email }).then((res) => {
      setProjects(res.data.projects);
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
      <div className="  h-full   grid grid-cols-4 gap-4 p-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="flex flex-col items-center gap-2">
              <div
                onClick={() => {
                  router.push(`/dashboard/generate-resume/page2/${project.id}`);
                }}
                className="border-2 h-60 w-60 rounded-md cursor-pointer overflow-hidden relative"
              >
                <div className="h-full w-full relative">
                  <img
                    className=" h-full w-full"
                    src="https://i.pinimg.com/originals/8e/6f/64/8e6f64217df3d96711e200bf1432fceb.gif"
                  />
                </div>
              </div>
              <div>
                <div>{project.name}</div>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-60 w-60" />
              <Skeleton className="h-5 w-60" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-60 w-60" />
              <Skeleton className="h-5 w-60" />
            </div>
          </>
        )}

        <div
          onClick={() => {
            router.push("/dashboard/generate-resume/page1");
          }}
          className="border-2 border-dashed h-60 w-60 rounded-md cursor-pointer overflow-hidden relative flex justify-center items-center"
        >
          <Plus size={40} className="text-muted-foreground" />{" "}
        </div>
      </div>
    </div>
  );
};

export default page;
