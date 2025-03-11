"use client";

import React, { useState, useEffect } from "react";

const CompanySearch = () => {
  const [municipalities, setMunicipalities] = useState([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch municipalities
  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const response = await fetch(
          "https://data.brreg.no/enhetsregisteret/api/kommuner"
        );
        if (!response.ok) throw new Error("Failed to fetch municipalities");

        const data = await response.json();
        console.log("Municipalities API Response:", data);

        if (data._embedded?.kommuner && Array.isArray(data._embedded.kommuner)) {
          setMunicipalities(data._embedded.kommuner);
        } else {
          console.error("Unexpected API response format:", data);
          setMunicipalities([]);
          throw new Error("Municipality data is not an array");
        }
      } catch (err) {
        setError(err.message);
        setMunicipalities([]);
      }
    };

    fetchMunicipalities();
  }, []);

  // Fetch companies based on selection
  const fetchCompanies = async () => {
    if (!selectedMunicipality || !year) return;

    setLoading(true);
    setError(null);

    const fromDate = `${year}-01-01`;
    const toDate = `${year}-12-31`;

    try {
      const response = await fetch(
        `https://data.brreg.no/enhetsregisteret/api/enheter?kommunenummer=${selectedMunicipality}&size=10000&fraStiftelsesdato=${fromDate}&tilStiftelsesdato=${toDate}`
      );

      if (!response.ok) throw new Error("Failed to fetch companies");

      const data = await response.json();
      setCompanies(data._embedded?.enheter || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">
        Find Companies in Norway  
      </h1>

      {/* Municipality Dropdown */}
      <label className="block text-lg mb-2">🌍 Select Municipality:</label>
      <select
        value={selectedMunicipality}
        onChange={(e) => setSelectedMunicipality(e.target.value)}
        className="w-full p-3 border rounded bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={municipalities.length === 0}
      >
        <option value="">Select Municipality</option>
        {municipalities.map((muni) => (
          <option key={muni.nummer} value={muni.nummer}>
            {muni.navn} ({muni.nummer})
          </option>
        ))}
      </select>

      {/* Year Input */}
      <label className="block text-lg mt-4 mb-2">📅 Enter Year:</label>
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="w-full p-3 border rounded bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        min="1900"
        max={new Date().getFullYear()}
      />

      {/* Search Button */}
      <button
        onClick={fetchCompanies}
        className="w-full mt-6 px-4 py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
        disabled={!selectedMunicipality}
      >
        🔍 Find Companies
      </button>

      {/* Loading & Error Messages */}
      {loading && <p className="mt-4 text-yellow-400">⏳ Loading...</p>}
      {error && <p className="mt-4 text-red-400">⚠️ Error: {error}</p>}

      {/* Display Companies */}
      <div className="mt-8">
        {companies.length === 0 && !loading ? (
          <p className="text-gray-400">❌ No companies found for this selection.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => (
              <div
                key={company.organisasjonsnummer}
                className="border border-gray-700 p-4 rounded-lg bg-gray-800 shadow-md hover:shadow-lg transition"
              >
                <h2 className="font-bold text-blue-300">{company.navn}</h2>
                <p className="text-sm text-gray-400">
                  🏢 Founded: {company.stiftelsesdato || "N/A"}
                </p>
                <p className="text-sm text-gray-400">
                  🆔 Org. Number: {company.organisasjonsnummer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanySearch;
