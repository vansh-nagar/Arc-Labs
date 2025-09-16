import React from "react";

const page = () => {
  return (
    <div className=" h-screen w-full flex  justify-center items-center">
      <img
        src="https://i.pinimg.com/originals/c1/5d/79/c15d796a596caa398ab322c416cd6056.gif"
        alt=""
        className=" h-fit w-full object-cover mask-radial-at-center mask-radial-from-30% mask-radial-farthest-side pointer-events-none"
      />
      <div className=" absolute"> Page Not Found!</div>
    </div>
  );
};

export default page;
