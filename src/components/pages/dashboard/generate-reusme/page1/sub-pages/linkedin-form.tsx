"use cleient";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/file-upload";
import axios from "axios";

const LinkedinForm = () => {
  const [LinkedinUrl, setLinkedinUrl] = useState("");

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Form submitted");

    axios
      .post("/api/generate-html/linkedin", { LinkedinUrl })
      .then((response) => {
        console.log("Response from server:", response.data);
      })
      .catch((error) => {
        console.error("Error from server:", error);
      });
  };
  return (
    <div className=" overflow-hidden">
      <div className="mb-2 text-2xl">Enter your linkedin URL</div>
      <Alert variant="default" className=" mb-2">
        <Terminal />
        <AlertTitle>Steps!</AlertTitle>
        <AlertDescription>
          <span>
            Step 1:{" "}
            <a
              target="_blank"
              className=" underline"
              href="https://www.linkedin.com/in/"
            >
              Go to linkedin.com/in/
            </a>{" "}
            (this will redirect to your profile)
          </span>
          <span>Step 2: Copy the URL from your browser and paste it below</span>
        </AlertDescription>
      </Alert>
      <Input
        onChange={(e) => {
          setLinkedinUrl(e.target.value);
        }}
        placeholder="Paste your LinkedIn URL here"
      />
      <Button onClick={handleSubmit} className=" mt-4 w-full">
        Submit
      </Button>
    </div>
  );
};

export default LinkedinForm;
