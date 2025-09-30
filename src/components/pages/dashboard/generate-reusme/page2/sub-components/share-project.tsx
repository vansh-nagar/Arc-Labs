import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import React from "react";
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
import { ShineBorder } from "@/components/ui/shine-border";
import axios from "axios";
import {
  LinkPermissionType,
  useProjectData,
} from "@/stores/gnerate-reusme/project-data-store";

const ShareProject = () => {
  const { projectId, urlPermission, setUrlPermission, isOwner } =
    useProjectData();

  const handleLinkPermissionChange = (newPermission: LinkPermissionType) => {
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
        <Button variant="outline" size="icon" disabled={!isOwner}>
          <Link />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-2">
        <ShineBorder />
        <DropdownMenuLabel className="text-muted-foreground">
          General access
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className=" flex items-center justify-between mt-2 ml-1">
          <div> Any one with the link</div>
          <Select
            onValueChange={(newPermission: LinkPermissionType) => {
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
