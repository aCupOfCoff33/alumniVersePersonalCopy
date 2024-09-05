import React from "react";
import { ExpandableCardDemo } from "./NetworkingPart";

export const SimpleBackgroundGradient = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#0A0F1E] via-[#1c255b] to-[#000526] animate-gradient-x">
      {children}
    </div>
  );
};

export default function PresentingIt() {
  return (
    <>
      <SimpleBackgroundGradient>
        <div className="pt-1 px-8 flex flex-col items-center">
          <div className="mt-8 w-full">
            <ExpandableCardDemo />
          </div>
        </div>
      </SimpleBackgroundGradient>
    </>
  );
}
