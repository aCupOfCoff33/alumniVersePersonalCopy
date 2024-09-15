import { Link } from "react-router-dom";
import WobbleCardDemo from "./HomePage/WDSCult.jsx";
import AlumniWorking from "./HomePage/AlumniWorking.jsx";
import MainImage from "../images/Logo.svg";
import React from "react";

export const SimpleBackgroundGradient = ({ children }) => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-[#0A0F1E] via-[#1c255b] to-[#000526] animate-gradient-x">
      <div className="flex items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default function IntroForFirstPage() {
  return (
    <>
      <SimpleBackgroundGradient>
        {/* Adjust absolute positioning */}
        <div className="absolute z-30 inset-0 flex flex-col items-center justify-center text-white font-bold px-4 text-3xl text-center md:text-4xl lg:text-7xl">
          <div className="flex flex-col items-center justify-center w-full">
            {/* Main Image */}
            <img
              src={MainImage}
              alt="Main Image"
              className="w-[200px] sm:w-[300px] lg:w-[400px] mb-4" // Reduced bottom margin for MainImage
            />

            <div className="text-center text-white text-[40px] font-bold font-['DM Sans'] mb-2">
              {" "}
              {/* Reduced margin-bottom */}
              Welcome to the <br />
              Western Developer Database!
            </div>

            <div className="text-center text-white text-xl font-normal font-['DM Sans'] mb-4">
              {" "}
              {/* Reduced margin-bottom */}
              Explore alumni who have worked at the top tech companies around
              the world....
            </div>

            <div className="w-full flex justify-center">
              <Link
                to="/network"
                className="relative inline-flex h-[45px] w-[300px] overflow-hidden rounded-[11px] p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-[11px] bg-[#000000] text-white text-xl font-bold font-['DM Sans'] backdrop-blur-3xl">
                  Start Networking
                </span>
              </Link>
            </div>
          </div>
        </div>
      </SimpleBackgroundGradient>

      {/* The second section */}
      <SimpleBackgroundGradient>
        <div className="relative z-20 lg:mt-[-100px] sm:mt-[-96px]">
          {" "}
          <WobbleCardDemo />
        </div>
      </SimpleBackgroundGradient>

      {/* AlumniWorking section */}
      <div className="relative z-20">
        <AlumniWorking />
      </div>
    </>
  );
}
