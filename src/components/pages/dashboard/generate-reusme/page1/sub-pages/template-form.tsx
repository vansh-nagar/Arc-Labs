"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { templates } from "@/data/templates";
import { generateResumeDataStore } from "@/stores/generate_resume_p1";

const TemplateForm = () => {
  const router = useRouter();
  const { setType, setData } = generateResumeDataStore();
  return (
    <div className="p-0 sm:p-4 ">
      <div className=" column-1 md:columns-2 ">
        {templates.map((template, index) => (
          <img
            key={index}
            src={template.image}
            alt=""
            onClick={() => {
              setData({ template: template.template });
              setType("template");
              router.push("/dashboard/generate-resume/page2/new");
            }}
            className=" mb-4 object-contain  cursor-pointer  border border-border rounded-sm  border-dotted bg-gradient-to-r hover:shadow-lg  shadow transition-all duration-150"
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateForm;
