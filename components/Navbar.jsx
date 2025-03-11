"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to close menu when clicking a link
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-gray-800 text-white p-4 fixed top-0 w-full z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-400">
          KommuneFinder
        </Link>

        {/* Hamburger Menu (Mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-2xl focus:outline-none"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Mobile Menu (Slides in) */}
        <div
          className={`absolute top-16 right-0 w-2/3 sm:w-auto bg-gray-900 shadow-lg p-4 sm:shadow-none sm:static sm:flex sm:gap-6 transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full sm:translate-x-0"
          }`}
        >
          <Link
            href="/"
            className="block sm:inline py-2 px-4 hover:bg-gray-700 sm:hover:bg-transparent"
            onClick={closeMenu} // Closes menu when clicked
          >
            Home
          </Link>
          <Link
            href="/kommune"
            className="block sm:inline py-2 px-4 hover:bg-gray-700 sm:hover:bg-transparent"
            onClick={closeMenu} // Closes menu when clicked
          >
            Municipalities
          </Link>
          <Link
            href="/companies"
            className="block sm:inline py-2 px-4 hover:bg-gray-700 sm:hover:bg-transparent"
            onClick={closeMenu} // Closes menu when clicked
          >
            Companies
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
