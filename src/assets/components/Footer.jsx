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
                <Link to="https://westerndev-website-theta.vercel.app/" className="hover:text-gray-400" target="_blank">
                  Western Developer’s Society
                </Link>
              </span>
              <br />
              <span>Built by </span>
              <Link
                to="https://www.linkedin.com/in/aaryanj"
                className="hover:text-gray-400"
                target="_blank"
              >
                @Aaryan
              </Link>
              <span>, </span>
              <Link
                to="https://www.linkedin.com/in/lblommesteyn/"
                className="hover:text-gray-400"
                target="_blank"
              >
                @Luke
              </Link>
              <span> and </span>
              <Link
                to="=https://www.linkedin.com/in/sharaf-syed/"
                className="hover:text-gray-400"
                target="_blank"
              >
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
              <Link
                to="https://www.instagram.com/westerndevsociety"
                className="hover:text-gray-400"
                target="_blank"
              >
                Instagram
              </Link>
              <Link
                to="https://www.linkedin.com/company/western-dev-society"
                className="hover:text-gray-400"
                target="_blank"
              >
                LinkedIn
              </Link>
              <Link
                to="https://discord.gg/4RXMZwyq"
                className="hover:text-gray-400"
                target="_blank"
              >
                Discord
              </Link>
              <Link
                to="https://www.facebook.com/westerndevsociety"
                target="_blank"
                className="hover:text-gray-400"
              >
                Facebook
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
