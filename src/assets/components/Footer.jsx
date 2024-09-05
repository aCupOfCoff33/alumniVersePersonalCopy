import { Link } from "react-router-dom";
import WDSLogo from "../images/Logo.png";

export default function Footer() {
  return (
    <footer className="overflow-x-hidden max-w-full">
      <div className="w-full bg-black px-5 sm:px-10 py-6 sm:py-8 box-border">
        <div className="flex flex-col space-y-6 sm:space-y-0 sm:flex-row justify-between items-start sm:items-center">
          <div className="flex flex-row items-center space-x-4">
            <img src={WDSLogo} alt="WDS Logo" className="h-12" />
            <div className="text-white text-xs sm:text-sm md:text-base font-bold font-['DM Sans']">
              <span>
                A product by{" "}
                <Link to="#" className="hover:text-gray-400">
                  Western Developer’s Society
                </Link>
              </span>
              <br />
              <span>Built by </span>
              <Link to="#" className="hover:text-gray-400">
                @Aaryan
              </Link>
              <span>, </span>
              <Link to="#" className="hover:text-gray-400">
                @Luke
              </Link>
              <span> and </span>
              <Link to="#" className="hover:text-gray-400">
                @Sharaf
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between w-full sm:w-auto space-y-6 sm:space-y-0 sm:space-x-8">
            <div className="flex flex-col items-start sm:items-end space-y-2 text-white text-xs sm:text-sm md:text-base font-bold font-['DM Sans']">
              <Link to="#" className="hover:text-gray-400">
                Home
              </Link>
              <Link to="#network" className="hover:text-gray-400">
                Our Network
              </Link>
              <Link to="#about" className="hover:text-gray-400">
                About Us
              </Link>
              <Link to="#contact" className="hover:text-gray-400">
                Contact Us
              </Link>
            </div>

            {/* Right column of links */}
            <div className="flex flex-col items-start sm:items-end space-y-2 text-white text-xs sm:text-sm md:text-base font-bold font-['DM Sans']">
              <Link to="#" className="hover:text-gray-400">
                Instagram
              </Link>
              <Link to="#" className="hover:text-gray-400">
                LinkedIn
              </Link>
              <Link to="#" className="hover:text-gray-400">
                Discord
              </Link>
              <Link to="#" className="hover:text-gray-400">
                X (Twitter)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
