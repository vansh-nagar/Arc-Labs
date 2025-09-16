import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { optionsStore } from "@/stores/generate_resume_p1";

const P1LeftSide = () => {
  const { selectedOption, setSelectedOption } = optionsStore();

  const options = [
    { label: "PDF", onClick: () => setSelectedOption(0) },
    { label: "Manual", onClick: () => setSelectedOption(1) },
    { label: "Template", onClick: () => setSelectedOption(2) },
    { label: "Linkedin", onClick: () => setSelectedOption(3) },
  ];
  return (
    <>
      <div className="   max-lg:border-none border-r ">
        <div className="sticky top-20">
          <h1 className=" font-semibold text-2xl sm:text-3xl   ">
            Select how you want to {""}
            <span className=" underline  decoration-neutral-100 ">
              get started
            </span>
          </h1>
          <div className=" flex flex-wrap gap-2 mt-5  lg:mt-5 mr-4 mb-4">
            {options.map((option, index) => (
              <Button
                key={option.label}
                className={`p-4 border rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                  selectedOption === index
                    ? "bg-neutral-200 dark:bg-neutral-800"
                    : ""
                }`}
                onClick={option.onClick}
                variant={"outline"}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default P1LeftSide;
