"use client";

import React, { useEffect } from "react";

const ErrorComponent = ({ error, reset }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-4 bg-red-100 text-red-800 border border-red-500 rounded">
      <p className="mb-2">{error.message}</p>
      
      <button 
        onClick={() => reset()} 
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
      >
        Reset Me
      </button>
    </div>
  );
};

export default ErrorComponent;
