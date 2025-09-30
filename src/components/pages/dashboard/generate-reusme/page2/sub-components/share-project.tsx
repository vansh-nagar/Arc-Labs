import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ShineBorder } from "@/components/ui/shine-border";
import { useProjectData } from "@/stores/gnerate-reusme/generate-resume-p1";
import axios from "axios";

const ShareProject = () => {
  const { permissionType, projectId, urlPermission, setUrlPermission } =
    useProjectData();

  const handleLinkPermissionChange = (newPermission: string) => {
    setUrlPermission(newPermission);
    axios
      .post("/api/generate-html/share/edit-link-permission", {
        newPermission,
        projectId,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Link />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-2">
        <ShineBorder />
        <DropdownMenuLabel>Share</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-muted-foreground">
          Special access
        </DropdownMenuLabel>

        <div className=" flex flex-col gap-2 py-2">
          <Input size={9} placeholder="Search...." />
          <div className=" mt-2 flex  flex-col gap-1 max-h-44  mask-b-from-90% mask-t-from-90% overflow-y-auto hide-scrollbar">
            {" "}
            {Array.from([1, 2, 3, 4, 5, 6, 7]).map((item) => (
              <div key={item} className=" flex gap-2 items-center">
                <img
                  src="https://i.pinimg.com/736x/07/46/3e/07463ee1e49f11c06655128369416b7c.jpg"
                  className=" h-10 w-10 rounded-full"
                  alt=""
                />
                <div className=" flex justify-between items-center flex-grow">
                  <div className="  leading-5 ">
                    Username <br />
                    Email
                  </div>
                  <Select>
                    <SelectTrigger size="sm" className="w-[120px] ">
                      <SelectValue placeholder="Can view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Can view</SelectItem>
                      <SelectItem value="dark">Can edit</SelectItem>
                      <SelectItem value="system">Full Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DropdownMenuLabel className="text-muted-foreground">
          General access
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className=" flex items-center justify-between mt-2 ml-1">
          <div> Any one with the link</div>
          <Select
            onValueChange={(newPermission) => {
              handleLinkPermissionChange(newPermission);
            }}
            value={urlPermission}
          >
            <SelectTrigger size="sm" className="w-[140px] ">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VIEW">Can view</SelectItem>
              <SelectItem value="EDIT">Can edit</SelectItem>
              <SelectSeparator />
              <SelectItem value="LOCKED">Lock</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-2 ml-1 flex items-center justify-between">
          <div>Expiration Time</div>
          <Select>
            <SelectTrigger size="sm" className="w-[140px]">
              <SelectValue placeholder="Never" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="6h">6 hours</SelectItem>
              <SelectItem value="12h">12 hours</SelectItem>
              <SelectItem value="1d">1 day</SelectItem>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          className="mt-2 w-full"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard");
          }}
        >
          Copy link
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareProject;
