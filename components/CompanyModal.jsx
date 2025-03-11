"use client";

import React from "react";

const CompanyModal = ({ company, onClose }) => {
  if (!company) return null;

  const website =
    company.hjemmeside ||
    `https://www.google.com/search?q=${encodeURIComponent(company.navn)}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`p-6 rounded-lg shadow-lg max-w-lg ${
          company.konkurs ? "bg-red-600 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-xl font-bold">{company.navn}</h2>
        <p>📜 Org. Number: {company.organisasjonsnummer}</p>
        <p>📅 Founded: {company.stiftelsesdato || "N/A"}</p>
        <p>🏢 Industry: {company.naeringskode1?.beskrivelse || "N/A"}</p>

        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-4 text-blue-500 hover:underline"
        >
          🌍 Visit Website
        </a>

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CompanyModal;
