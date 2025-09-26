"use client";
import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { MultiStepLoader } from "@/components/ui/multistep-loader";
import { useSidebarStore } from "@/stores/sidebarStore";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/shadcn-io/dropzone";
import { Confetti } from "@/components/ui/confetti";
import { Ripple } from "@/components/ui/ripple";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const OnboardingSteps = () => {
  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();
  const [Resume, setResume] = useState<File | null>(null);
  const [UserName, setUserName] = useState("");
  const [Error, setError] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [jobTitle, setjobTitle] = useState("");

  const [showConfetti, setshowConfetti] = useState(false);

  const { isSideBarOpen } = useSidebarStore();

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const steps = [
    {
      title: "Upload your resume",
      description:
        "Share your resume to quickly build your profile and highlight your experience.",
      content: (
        <div>
          <Dropzone
            maxFiles={1}
            onDrop={(e: any) => {
              if (e.target.files && e.target.files.length > 0) {
                setResume(e.target.files[0]);
              }
            }}
            onError={console.error}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>
      ),
    },
    {
      title: "Set up your profile",
      description:
        "Add personal details and preferences to complete your profile.",
      content: (
        <div className=" flex flex-wrap gap-3">
          <Input
            type="text"
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            placeholder="Full Name"
          />
          <Input
            type="text"
            onChange={(e) => {
              setjobTitle(e.target.value);
            }}
            placeholder="Enter the job title "
          />
        </div>
      ),
    },
    {
      title: "Complete onboarding",
      description: "Review your details and finish the onboarding process.",
      content: (
        <div>
          <p>All set! 🎉</p>
        </div>
      ),
    },
  ];

  const handleSubmit = async () => {
    router.push("/dashboard/simulate-interview/page2");

    if (isLoading) return;
    setisLoading(true);
    setshowConfetti(true);

    const formdata = new FormData();
    if (Resume) {
      formdata.append("resume", Resume);
    }
    formdata.append("name", UserName);
    formdata.append("jobTitle", jobTitle);

    axios
      .post("/api/getQues", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data.message);
        if (res.status === 200) {
          console.log(res);
          localStorage.setItem("questions", res.data.message);
          // router.push("/dashboard/simulate-interview/page2");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response?.data?.error || "Something went wrong");
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  return (
    <div
      className={`   ${
        isSideBarOpen
          ? "dashboard-content-sidebar-open"
          : "dashboard-content-sidebar-close"
      }   flex justify-center items-center  relative overflow-hidden `}
    >
      {showConfetti && (
        <Confetti className=" absolute inset-0  h-full w-full " />
      )}
      <div className="h-full w-full absolute">
        {/* Radial Gradient Background */}
        <div
          className="absolute inset-0 z-0 animate-pulse "
          style={{
            background:
              "radial-gradient(125% 125% at 50% 10%, transparent 40%, #6366f1 100%)",
            animationDuration: "10s",
          }}
        />
        {/* Your Content/Components */}
      </div>
      {isLoading && <Ripple className=" absolute inset-0 " />}

      <div className=" z-40   ">
        <div className="flex  flex-wrap items-center  gap-3 mb-3">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2 justify-center items-center">
              <div
                className={`w-10 h-10 flex  items-center justify-center rounded-md border ${
                  index === activeStep ? "bg-blue-600 text-white " : ""
                }`}
              >
                {index + 1}
              </div>
              <p className="text-sm font-semibold">{step.title}</p>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="w-full   rounded-lg  shadow p-3 bg-accent/30  backdrop-blur-sm  ">
          <h2 className="text-xl font-semibold mb-1 underline decoration-accent text-shadow-sm">
            {steps[activeStep].title}
          </h2>
          <p className="text-foreground mb-4 text-sm ">
            {steps[activeStep].description}
          </p>
          {steps[activeStep].content}
        </div>

        {/* Navigation Buttons */}
        <div className="flex  justify-end mt-3 gap-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button
            onClick={() => {
              if (activeStep === steps.length - 1) {
                handleSubmit();
              } else {
                nextStep();
              }
            }}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : activeStep === steps.length - 1 ? (
              "Finish"
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSteps;
