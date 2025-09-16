"use client";
import { useRouter } from "next/navigation";
import React from "react";
const Images = [
  {
    link: "https://ik.imagekit.io/ijuiklevk/45943.jpeg",
    text: "Template 1",
  },
  {
    link: "https://ik.imagekit.io/ijuiklevk/38460.jpeg",
    text: "Template 1",
  },
  {
    link: "https://ik.imagekit.io/ijuiklevk/38460.jpeg",
    text: "Template 1",
  },
  {
    link: "https://ik.imagekit.io/ijuiklevk/45943.jpeg",
    text: "Template 1",
  },
];

const TemplateForm = () => {
  const router = useRouter();
  return (
    <div className="p-0 sm:p-4 ">
      <div className=" column-1 md:columns-2 ">
        {Images.map((image, index) => (
          <img
            key={index}
            src={image.link}
            alt=""
            onClick={() => router.push("/dashboard/generate_resume/p2")}
            className=" mb-4 object-contain  cursor-pointer  border border-border rounded-sm  border-dotted bg-gradient-to-r hover:shadow-lg  shadow transition-all duration-150"
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateForm;
