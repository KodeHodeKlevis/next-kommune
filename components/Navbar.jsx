import React from "react";
import Link from "next/link";

const links = [
  { href: "/", text: "Home" },
  { href: "/kommune", text: "Kommune" },
];

const Navbar = () => {
  return (
    <nav className="p-4 bg-gray-800 text-white">
      <div className="flex space-x-4">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="hover:underline">
            {link.text}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
