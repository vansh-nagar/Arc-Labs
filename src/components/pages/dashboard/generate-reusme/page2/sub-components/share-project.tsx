import { Button } from "@/components/ui/button";
import {
  IdCard,
  IdCardIcon,
  IdCardLanyardIcon,
  Link,
  RefreshCcw,
} from "lucide-react";
import React from "react";
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
import { Avatar } from "@/components/ui/avatar";
import { ShineBorder } from "@/components/ui/shine-border";

const ShareProject = () => {
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
          <div className=" flex gap-2 ">
            <Input size={9} placeholder="Search...." />
            <Button variant="outline">Invite</Button>
          </div>
          <div className=" mt-2">
            {" "}
            <div className=" flex justify-start gap-2 ">
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
          </div>
        </div>

        <DropdownMenuSeparator />
        <div className="flex flex-col  gap-2 p- ">
          <DropdownMenuLabel className=" mb-2">
            ShareGenerate Room ID
          </DropdownMenuLabel>
          <div className=" flex items-center justify-between">
            {" "}
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button variant="outline" size={"icon"} className=" ml-2">
              <RefreshCcw />
            </Button>
          </div>{" "}
          <Select>
            <SelectTrigger className=" w-full mt-2 ">
              <SelectValue placeholder="Link Expiration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Can view</SelectItem>
              <SelectItem value="dark">Can edit</SelectItem>
              <SelectItem value="system">Full Access</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="default" className="  ">
            Copy code
          </Button>
          <Button variant="destructive" className="mb-2  ">
            Kill Session
          </Button>
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
