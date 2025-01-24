import React, { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Card({ children }: Props) {
  return (
    <div className="relative py-3 sm:max-w-xl sm:mx-auto">
      <div
        className="rounded-3xl flex bg-white p-7 justify-between flex-col space-y-6 sm:space-y-0 items-center sm:items-stretch sm:flex-row"
        id="widget"
      ></div>
    </div>
  );
}
