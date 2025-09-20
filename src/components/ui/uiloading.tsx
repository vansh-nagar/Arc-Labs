import React from "react";

const UILoading = () => {
  return (
    <div className="ml-3 h-full border rounded-md p-6">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded-md w-1/3 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded-md w-2/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-8"></div>

        <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-6"></div>

        <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-2/3 mb-6"></div>

        <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-4/5 mb-2"></div>
      </div>
    </div>
  );
};

export default UILoading;
