"use client";
export default function Loading({ text = "Loading..." }) {
  return (
    <div className="py-10 text-center text-sm opacity-70">{text}</div>
  );
}

