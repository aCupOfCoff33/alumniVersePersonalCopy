"use client";

import React from "react";
import { WobbleCard } from "../ui/wobble-card";
import image1 from "./wobbley/image1.jpg";
import image2 from "./wobbley/image2.jpg";


export default function WobbleCardDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 h-full min-h-[500px] lg:min-h-[300px] bg-[#090D28]"
        className=""
      >
        <div className="max-w-xs">
          <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            WESTERN UNIVERSITY’S STRONGEST ALUMNI NETWORK DESIGNED WITH YOU IN
            MIND
          </h2>
          <p className="mt-4 text-left  text-base/6 text-neutral-200">
            Connect with over 300 Western Alumni and turn your career dreams
            into reality with the support of an unmatched network.
          </p>
        </div>
        <img
          src={image1}
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
        />
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
          UNLOCK OPPORTUNITIES AT YOUR FINGERTIPS.
        </h2>
        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
          Find your path with access to alumni who have excelled in top
          industries worldwide
        </p>
      </WobbleCard>
      <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-[#001281] min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
        <div className="max-w-sm">
          <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            CONNECT WITH THE BEST AND BUILD LASTING CAREER CONNECTIONS
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Access our Alumni Network and engage with leaders driving change in their industries - and discover how you can be part of that change too
          </p>
        </div>
        <img
          src= {image2} 
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-20 object-contain rounded-2xl"
        />
      </WobbleCard>
    </div>
  );
}
