"use client";
import React from "react";
import Image1 from "./wobbley/Picture1.jpg";
import Image2 from "./wobbley/image2.jpg"; // Replace with correct image paths

export function ResponsiveCardDemo() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* First Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Text Block */}
        <div className="space-y-4">
          <h2 className="text-white text-3xl lg:text-5xl font-bold font-['DM Sans']">
            WESTERN UNIVERSITY’S <br />
            <span className="underline">STRONGEST</span> ALUMNI
            <br />
            NETWORK DESIGNED WITH YOU IN MIND
          </h2>
          <p className="text-white text-lg lg:text-xl">
            Connect with over{" "}
            <span className="underline font-bold">300 Western Alumni</span> and
            turn your career dreams into reality with the support of an
            unmatched network.
          </p>
        </div>
        {/* Image Block */}
        <div className="relative">
          <img
            src={Image1}
            alt="Alumni Network"
            className="rounded-lg object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Second Section */}
      <div className="bg-[#2f41b0] p-6 rounded-lg space-y-4">
        <h2 className="text-white text-2xl lg:text-4xl font-bold font-['DM Sans']">
          UNLOCK OPPORTUNITIES <br />
          AT YOUR FINGERTIPS
        </h2>
        <p className="text-white text-lg lg:text-xl">
          Find your path with access to alumni who have excelled in top
          industries worldwide.
        </p>
      </div>

      {/* Third Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Text Block */}
        <div className="space-y-4">
          <h2 className="text-white text-3xl lg:text-5xl font-bold font-['DM Sans']">
            CONNECT WITH THE BEST <br />
            AND BUILD LASTING <br />
            CAREER CONNECTIONS
          </h2>
          <p className="text-white text-lg lg:text-xl">
            Access our Alumni Network and engage with leaders driving change in
            their industries —{" "}
            <span className="underline font-bold">
              and discover how you can be part of that change too.
            </span>
          </p>
        </div>
        {/* Image Block */}
        <div className="relative">
          <img
            src={Image2}
            alt="Career Connections"
            className="rounded-lg object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

export default ResponsiveCardDemo;
