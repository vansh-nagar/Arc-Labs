import { Button } from "@/components/ui/button";
import { Info, Link, Terminal } from "lucide-react";
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
import { ShineBorder } from "@/components/ui/shine-border";
import axios from "axios";
import {
  LinkPermissionType,
  useProjectData,
} from "@/stores/gnerate-reusme/project-data-store";
import Countdown from "@/components/ui/countdown";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const ShareProject = () => {
  const {
    projectId,
    urlPermission,
    setUrlPermission,
    isOwner,
    linkExpiresAt,
    setLinkExpiresAt,
  } = useProjectData();

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

  const [timeRemaining, setTimeRemaining] = useState(0);

  const handleChangeLinkExpiry = (newExpiry: string) => {
    let expiry;
    if (newExpiry === "null") expiry = null;
    const now = new Date();
    const unit = newExpiry.slice(-1);
    const amount = parseInt(newExpiry.slice(0, -1));

    if (unit === "m") expiry = new Date(now.getTime() + amount * 10 * 1000);

    if (unit === "h")
      expiry = new Date(now.getTime() + amount * 60 * 60 * 1000);

    if (unit === "d")
      expiry = new Date(now.getTime() + amount * 24 * 60 * 60 * 1000);

    setLinkExpiresAt(expiry as Date | null);

    axios
      .post("/api/generate-html/share/set-link-expiry", {
        newExpiry: expiry,
        projectId,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function expiryToSelectValue(expiry: Date | null): string {
    if (!expiry) return "null"; // Never
    const expiryDate = expiry instanceof Date ? expiry : new Date(expiry);

    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours <= 1) return "1h";
    if (diffHours <= 6) return "6h";
    if (diffHours <= 12) return "12h";
    if (diffHours <= 24) return "1d";
    if (diffDays <= 7) return "7d";

    return "null"; // fallback
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" disabled={!isOwner}>
          <Link />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-2">
        <ShineBorder shineColor={["#ffffff", "#000000"]} />
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
          <Select
            onValueChange={(newExpiry: string) =>
              handleChangeLinkExpiry(newExpiry)
            }
            value={expiryToSelectValue(linkExpiresAt)}
          >
            <SelectTrigger size="sm" className="w-[140px]">
              <SelectValue placeholder="Never" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="6h">6 hours</SelectItem>
              <SelectItem value="12h">12 hours</SelectItem>
              <SelectItem value="1d">1 day</SelectItem>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="null">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-2 ml-1 py-1 flex justify-between items-center ">
          <div>Expires in</div>
          <Countdown
            expiry={linkExpiresAt}
            projectId={projectId}
            setUrlPermission={setUrlPermission}
          />
        </div>
        <Separator className="my-2 border-muted-foreground" />

        <Alert variant="default" className=" mt-2">
          <Info />
          <AlertTitle>Quick Guide</AlertTitle>
          <AlertDescription>
            <ul className="list-decimal">
              <li>Set permissions and expiry for your link.</li>
              <li>Expired links automatically lock for safety.</li>
              <li>Share the link; access follows your settings.</li>
            </ul>
          </AlertDescription>
        </Alert>
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
