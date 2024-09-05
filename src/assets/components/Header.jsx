import { Link } from "react-router-dom";
import { useState } from "react";
import WDSHeaderLogo from "../images/WDSlogo.svg";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="w-full bg-[#d9d9d9] flex items-center justify-between px-8 sticky top-0 z-50 h-[107px]">
      <div className="flex items-center h-full">
        <Link to="/">
          <img
            src={WDSHeaderLogo}
            alt="Logo"
            className="h-[74px] md:h-[80px] object-contain cursor-pointer"
          />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-8 h-full items-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center h-[45px] w-[90px] text-xl font-bold font-['DM Sans'] text-white bg-[#1c255b] border-2 border-gray-600 rounded-[11px] no-underline transition-all duration-300 ease-in-out hover:bg-white hover:text-[#1c255b] hover:border-[#1c255b]"
        >
          Home
        </Link>

        <Link
          to="/network"
          className="inline-flex items-center justify-center h-[45px] w-[98px] text-xl font-bold font-['DM Sans'] text-white bg-[#1c255b] border-2 border-gray-600 rounded-[11px] no-underline transition-all duration-300 ease-in-out hover:bg-white hover:text-[#1c255b] hover:border-[#1c255b]"
        >
          Network
        </Link>

        <Link
          to="/about"
          className="inline-flex items-center justify-center h-[45px] w-[90px] text-xl font-bold font-['DM Sans'] text-white bg-[#1c255b] border-2 border-gray-600 rounded-[11px] no-underline transition-all duration-300 ease-in-out hover:bg-white hover:text-[#1c255b] hover:border-[#1c255b]"
        >
          About
        </Link>

        <Link
          to="/contact"
          className="inline-flex items-center justify-center h-[45px] w-[95.82px] text-xl font-bold font-['DM Sans'] text-white bg-[#1c255b] border-2 border-gray-600 rounded-[11px] no-underline transition-all duration-300 ease-in-out hover:bg-white hover:text-[#1c255b] hover:border-[#1c255b]"
        >
          Contact
        </Link>
      </nav>

      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden flex items-center h-full">
        <button onClick={toggleMenu} className="text-[#1c255b] cursor-pointer">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="#1c255b"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-[107px] left-0 right-0 bg-black text-white flex flex-col items-center z-50 md:hidden">
          <Link to="/" className="py-2 text-lg" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/network" className="py-2 text-lg" onClick={toggleMenu}>
            Network
          </Link>
          <Link to="/about" className="py-2 text-lg" onClick={toggleMenu}>
            About
          </Link>
          <Link to="/contact" className="py-2 text-lg" onClick={toggleMenu}>
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}
