"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", text: "Home" },
  { href: "/kommune", text: "Kommune" },
  { href: "/companies", text: "Companies" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/*  Brand / Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition"
        >
          CompanyFinder
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg transition-all ${
                pathname === link.href
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              {link.text}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
