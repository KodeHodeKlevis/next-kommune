"use client";

import React, { useState, useEffect } from "react";
import CompanyModal from "./CompanyModal";

const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        console.log("Fetching companies...");
        const response = await fetch(
          "https://data.brreg.no/enhetsregisteret/api/enheter?size=100"
        );

        if (!response.ok) throw new Error("Failed to fetch companies");

        const data = await response.json();
        console.log("✅ Companies API Response:", data);

        setCompanies(data._embedded?.enheter || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading)
    return (
      <p className="text-yellow-400 text-center text-lg mt-6">
        ⏳ Loading companies...
      </p>
    );
  if (error)
    return (
      <p className="text-red-500 text-center text-lg mt-6">⚠️ Error: {error}</p>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-blue-400 mb-8 text-center">
        📌 List of Registered Companies
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {companies.map((company) => {
          const website =
            company.hjemmeside ||
            `https://www.google.com/search?q=${encodeURIComponent(
              company.navn
            )}`;

          return (
            <div
              key={company.organisasjonsnummer}
              className={`p-5 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-105 transition-transform ${
                company.konkurs ? "bg-red-600 text-white" : "bg-gray-800"
              }`}
              onClick={() => setSelectedCompany(company)} // ✅ Click to open modal
            >
              <h3 className="text-lg font-semibold text-blue-400 hover:underline">
                {company.navn}
              </h3>

              <p className="text-gray-400 text-sm">
                📜 Org. Number:{" "}
                <span className="text-blue-300">
                  {company.organisasjonsnummer}
                </span>
              </p>
              <p className="text-gray-400 text-sm mt-1">
                📅 Founded: {company.stiftelsesdato || "N/A"}
              </p>
              {company.konkurs && (
                <p className="text-yellow-300">⚠️ Bankrupt</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Show Modal when a company is selected */}
      {selectedCompany && (
        <CompanyModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  );
};

export default CompaniesList;
