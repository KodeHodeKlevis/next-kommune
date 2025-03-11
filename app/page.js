"use client";

import React from "react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-6">
      {/* Welcome Message */}
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-400 mb-6 text-center">
        🌍 Welcome to KommuneFinder
      </h1>

      <p className="text-lg text-gray-300 text-center max-w-2xl">
        Discover companies and municipalities across Norway. Start by selecting a municipality or searching for companies.
      </p>

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto">
        <Link href="/kommune">
          <button className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition shadow-md">
            🏙️ Explore Municipalities
          </button>
        </Link>

        <Link href="/companies">
          <button className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition shadow-md">
            🏢 Search Companies
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-gray-500 text-sm">
        🚀 Powered by Brønnøysund Registers' API
      </footer>
    </div>
  );
};

export default HomePage;
