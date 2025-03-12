"use client";

import React from "react";

const CompanyModal = ({ company, onClose }) => {
  if (!company) return null;

  const website = company.hjemmeside || null; // Check if website exists
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    company.navn
  )}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className={`p-6 rounded-lg shadow-lg max-w-lg w-full sm:w-3/4 md:w-1/2 ${
          company.konkurs ? "bg-red-600 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-xl font-bold">{company.navn}</h2>
        <p>📜 Org. Number: {company.organisasjonsnummer}</p>
        <p>📅 Founded: {company.stiftelsesdato || "N/A"}</p>
        <p>🏢 Industry: {company.naeringskode1?.beskrivelse || "N/A"}</p>
        <p>👥 Employees: {company.antallAnsatte || "Unknown"}</p>
        <p>📍 Address: {company.forretningsadresse?.adresse || "N/A"}</p>
        <p>🏛️ Municipality: {company.forretningsadresse?.kommune || "N/A"}</p>
        <p>📬 Postal Code: {company.forretningsadresse?.postnummer || "N/A"}</p>

        {/* Website Link - Opens in a New Tab */}
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-blue-500 hover:underline cursor-pointer "
          >
            🌍 Visit Website
          </a>
        ) : (
          <a
            href={googleSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-gray-500 hover:underline cursor-pointer "
          >
            🔍 Search on Google
          </a>
        )}

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
