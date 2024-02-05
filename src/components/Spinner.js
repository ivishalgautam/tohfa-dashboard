import React from "react";

export default function Spinner({ color }) {
  return (
    <div className="text-center">
      <div
        className={`${
          color ? `text-${color}` : "text-primary"
        } fill-blue-600 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      />
    </div>
  );
}
