{/* This part is not mobile responsive at all, but will be changed eventually*/}

import AnimatedLogoCloud from "./AnimatedLogos"; 
import { Link } from "react-router-dom";

export default function AlumniWorking() {
  return (
    <div className="w-full min-h-[237px] relative bg-[#090d28]">
      <div className="w-full h-auto left-0 top-0 bg-[#000526] flex flex-col justify-center items-center lg:items-start p-8 lg:pl-[30px] lg:h-[237px]">
        {/* Title */}
        <div className="text-center lg:text-left text-white text-[30px] lg:text-[40px] font-bold font-['DM Sans']">
          OUR WDS <br />
          ALUMNI NETWORK
        </div>

        {/* Button */}
        <Link to="/network">
          <button className="p-[3px] relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[11px] transition-all duration-200 opacity-100"></div>
            <div className="relative px-5 py-2 bg-black rounded-[11px] text-white text-xl font-bold font-['DM Sans'] transition duration-200 group-hover:bg-transparent">
              &gt; SEE MORE ALUMNI
            </div>
          </button>
        </Link>
      </div>

      {/* Animated Logo Cloud */}
      <div className="w-full h-auto mt-6 lg:mt-0 lg:absolute lg:top-0 lg:right-0 lg:w-3/4 flex justify-end items-center">
        <AnimatedLogoCloud /> 
      </div>
    </div>
  );
}
