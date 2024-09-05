import ImageOne from "./wobbley/image1.jpg";
import ImageTwo from "./wobbley/image2.jpg";
import { Link } from "react-router-dom";


export default function WDSCult() {
  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-none lg:h-screen lg:justify-center lg:items-center  bg-gradient-to-b from-[#0A0F1E] to-[#000526]">
      {" "}
      <div className="w-full lg:w-[1075px] h-auto lg:h-[781.42px] relative">
        {" "}
        <div className="w-full lg:w-[719.89px] h-auto lg:h-[382.36px] bg-[#090d28] rounded-[11px] lg:absolute lg:left-0 lg:top-[1.76px]">
          <div className="absolute left-[30px] top-[43.07px]">
            <div className="text-white text-[32px] font-bold font-['DM Sans'] leading-tight">
              WESTERN UNIVERSITY’S <br />
              <span className="underline">STRONGEST</span> ALUMNI <br />
              NETWORK DESIGNED <br />
              WITH YOU IN MIND
            </div>
            <div className="absolute top-[173.17px]">
              <span className="text-white text-2xl font-normal font-['DM Sans']">
                Connect with over{" "}
              </span>
              <span className="text-white text-2xl font-normal font-['DM Sans'] underline">
                300 Western Alumni
              </span>
              <span className="text-white text-2xl font-normal font-['DM Sans']">
                {" "}
                and turn your career dreams into reality with the support of an
                unmatched network.
              </span>
            </div>
            <img
              className="absolute w-[305.01px] h-[289.19px] left-[384.88px] top-[50.10px] rounded-tl-[11px] rounded-br-[11px]"
              src={ImageOne}
              alt="Western Alumni"
            />
          </div>
        </div>
        {/* Right Section */}
        <div className="w-full lg:w-[341.05px] h-auto lg:h-[384.12px] bg-[#2f41b0] rounded-[11px] lg:absolute lg:left-[733.95px] lg:top-0">
          <div className="absolute left-[22.85px] top-[44.83px]">
            <div className="text-white text-[32px] font-bold font-['DM Sans'] leading-tight">
              UNLOCK <br />
              OPPORTUNITIES <br />
              AT YOUR FINGERTIPS
            </div>
            <div className="absolute top-[173.16px]">
              <span className="text-white text-2xl font-normal font-['DM Sans']">
                Find{" "}
              </span>
              <span className="text-white text-2xl font-bold font-['DM Sans'] underline">
                your
              </span>
              <span className="text-white text-2xl font-normal font-['DM Sans']">
                {" "}
                path with access to alumni who have excelled in top industries
                worldwide
              </span>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="w-full lg:w-[1075px] h-auto lg:h-[383.24px] bg-[#001281] rounded-[11px] lg:absolute lg:left-0 lg:top-[398.18px]">
          <div className="absolute left-[30px] top-[35.16px]">
            <div className="text-white text-[32px] font-bold font-['DM Sans'] leading-tight">
              CONNECT WITH THE BEST <br />
              AND BUILD LASTING <br />
              CAREER CONNECTIONS
            </div>
            <div className="absolute top-[143.66px]">
              <span className="text-white text-2xl font-normal font-['DM Sans']">
                Access our Alumni Network and engage with leaders driving change
                in their industries -
              </span>
              <span className="text-white text-2xl font-bold font-['DM Sans'] underline">
                and discover how you can be part of that change too
              </span>
            </div>
            <img
              className="absolute w-[453.56px] h-[331.38px] left-[644.5px] top-[16.70px] rounded-tl-[11px] rounded-br-[11px]"
              src={ImageTwo}
              alt="Career Connections"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
