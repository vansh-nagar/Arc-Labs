"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { templates } from "@/data/templates";
import { generateResumeDataStore } from "@/stores/generate_resume_p1";

const TemplateForm = () => {
  const router = useRouter();
  const { setType, setData } = generateResumeDataStore();
  return (
    <div className="p-0 sm:pl-4 mask-b-from-70% ">
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
        <div className=" relative mb-4">
          <img
            src="https://i.pinimg.com/736x/56/17/d6/5617d6088a5794f177425ae6780041dd.jpg"
            alt=""
            className="  object-contain    border border-border rounded-sm  border-dotted bg-gradient-to-r hover:shadow-lg  shadow transition-all duration-150"
          />
          <div className=" absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 ">
            <p className="text-sm text-center text-black  font-medium">
              More templates coming soon!
            </p>
          </div>
        </div>
        <div className=" relative">
          <img
            src="https://i.pinimg.com/1200x/74/d3/ce/74d3cebceb792e1a49c7380ffde64b22.jpg"
            alt=""
            className="  object-contain    border border-border rounded-sm  border-dotted bg-gradient-to-r hover:shadow-lg  shadow transition-all duration-150"
          />
          <div className=" absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 ">
            <p className="text-sm text-center  font-medium text-white">
              Ask for Custom Templates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateForm;
