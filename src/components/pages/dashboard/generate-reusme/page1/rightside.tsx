import React from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { optionsStore } from "@/stores/generate_resume_p1";
import ManualForm from "./sub-pages/manual-form";
import TemplateForm from "./sub-pages/template-form";

const P1RightSide = () => {
  const { selectedOption } = optionsStore();

  return (
    <>
      <div className=" flex justify-center items-center   ">
        {selectedOption === 0 ? (
          <FileUpload />
        ) : selectedOption === 1 ? (
          <ManualForm />
        ) : selectedOption === 2 ? (
          <TemplateForm />
        ) : selectedOption === 3 ? (
          <>Linkedin</>
        ) : null}
      </div>
    </>
  );
};

export default P1RightSide;
