"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Lock } from "lucide-react";
import { AnimatedNumber_001 } from "@/components/ui/animated-count-down";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LightRays } from "@/components/ui/light-rays";

const Security = () => {
  const [countDown, setCountDown] = useState(60);
  const [permission, setPermission] = useState("VIEW");
  return (
    <div className=" border rounded-lg bg-background p-2  flex flex-col justify-end relative  bg-diagonal-grid shadow-[0_0_8px_rgba(0,0,0,0.2)]">
      <Lock
        size={130}
        className="text-muted absolute z-0 right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2"
      />
      <AnimatedNumber_001 duration={countDown} setPermission={setPermission} />
      <div className="z-20 flex items-center justify-between mt-2 ml-1">
        <div> Any one with the link</div>
        <Select
          value={permission}
          onValueChange={(value) => {
            setPermission(value);
          }}
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
      <div className="mt-2 z-20 ml-1 flex items-center justify-between">
        <div>Expiration Time</div>
        <Select
          onValueChange={(value) => setCountDown(Number(value))}
          value={countDown.toString()}
        >
          <SelectTrigger size="sm" className="w-[140px]">
            <SelectValue placeholder={countDown.toString()} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 sec</SelectItem>
            <SelectItem value="20">20 sec</SelectItem>
            <SelectItem value="30">30 sec</SelectItem>
            <SelectItem value="60">60 sec</SelectItem>
            <SelectItem value="0">Never</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Alert
        variant="default"
        className=" bg-background/10 backdrop-blur-sm mt-2"
      >
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
    </div>
  );
};

export default Security;
