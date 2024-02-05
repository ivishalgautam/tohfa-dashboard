import React from "react";

export default function Title({ text }) {
  return (
    <div className="flex items-center gap-x-2">
      <div className="w-[2px] h-6 bg-primary"></div>
      <h2 className="text-lg font-mulish font-semibold capitalize">{text}</h2>
    </div>
  );
}
