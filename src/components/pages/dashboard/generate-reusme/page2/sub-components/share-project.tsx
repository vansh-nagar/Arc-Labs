import { Button } from "@/components/ui/button";
import {
  IdCard,
  IdCardIcon,
  IdCardLanyardIcon,
  Link,
  RefreshCcw,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ShineBorder } from "@/components/ui/shine-border";

const ShareProject = () => {
  const [RandomCode, setRandomCode] = useState(
    Math.random().toString(36).slice(-6).toUpperCase()
  );

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
        <div className=" flex flex-col gap-2 py-2">
          <Input size={9} placeholder="Search...." />
          <div className=" mt-2 flex  flex-col gap-1 max-h-52  mask-b-from-90% mask-t-from-90% overflow-y-auto hide-scrollbar">
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
                    <SelectTrigger className="w-[120px] ">
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

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="mt-2"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard");
          }}
        >
          <Link /> Copy link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareProject;
