"use client";

import React, { useState, useEffect, useRef } from "react";
import CompanyModal from "./CompanyModal";

const SearchForm = ({ onSearch, hasSearched }) => {
  const [municipalities, setMunicipalities] = useState([]);
  const [filteredMunicipalities, setFilteredMunicipalities] = useState([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [searchMunicipality, setSearchMunicipality] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 12;
  const dropdownRef = useRef(null);

  // Fetch all municipalities
  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const response = await fetch(
          "https://data.brreg.no/enhetsregisteret/api/kommuner?size=200"
        );
        if (!response.ok) throw new Error("Failed to fetch municipalities");

        const data = await response.json();
        const allMunicipalities = data._embedded?.kommuner || [];

        setMunicipalities(allMunicipalities);
        setFilteredMunicipalities(allMunicipalities);
      } catch (err) {
        console.error("❌ Error fetching municipalities:", err);
      }
    };

    fetchMunicipalities();
  }, []);

  // Fetch featured companies on page load
  useEffect(() => {
    const fetchFeaturedCompanies = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://data.brreg.no/enhetsregisteret/api/enheter?size=50"
        );
        if (!response.ok) throw new Error("Failed to fetch featured companies");

        const data = await response.json();
        setFeaturedCompanies(data._embedded?.enheter || []);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCompanies();
  }, []);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter municipalities when typing
  useEffect(() => {
    if (!searchMunicipality) {
      setFilteredMunicipalities(municipalities);
    } else {
      setFilteredMunicipalities(
        municipalities.filter((muni) =>
          muni.navn.toLowerCase().includes(searchMunicipality.toLowerCase())
        )
      );
    }
  }, [searchMunicipality, municipalities]);

  // Pagination Logic for Featured Companies (i have no idea how this works, but it works)
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = featuredCompanies.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );

  const nextPage = () => {
    if (currentPage < Math.ceil(featuredCompanies.length / companiesPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-400 mb-6 text-center">
        Find Companies in Norway
      </h1>

      {/* Municipality Dropdown with Search */}
      <label className="block text-lg mb-2">🌍 Select Municipality:</label>
      <div className="relative" ref={dropdownRef}>
        {/* The amount it took me to do this, just no. Like why is it like this. 
        The amount of Youtube and ChatGPT was not worth it just for this. (It was worth it, im just salty) */}
        <input
          type="text"
          value={searchMunicipality}
          onChange={(e) => {
            setSearchMunicipality(e.target.value);
            setDropdownOpen(true);
          }}
          onFocus={() => setDropdownOpen(true)}
          placeholder="🔍 Type to search municipalities..."
          className="w-full p-3 border rounded bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {dropdownOpen && (
          <div className="absolute w-full bg-gray-800 border border-gray-600 rounded shadow-lg mt-1 max-h-60 overflow-y-auto">
            {filteredMunicipalities.map((muni) => (
              <div
                key={muni.nummer}
                onClick={() => {
                  setSelectedMunicipality(muni.nummer);
                  setSearchMunicipality(muni.navn);
                  setDropdownOpen(false);
                }}
                className="p-2 hover:bg-gray-700 cursor-pointer"
              >
                {muni.navn} ({muni.nummer})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Show selected municipality */}
      {selectedMunicipality && (
        <p className="mt-2 text-gray-300">✅ Selected: {searchMunicipality}</p>
      )}

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
        onClick={() => onSearch({ year, municipality: selectedMunicipality })}
        className="w-full mt-6 px-4 py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition cursor-pointer"
        disabled={!selectedMunicipality}
      >
        🔍 Find Companies
      </button>

      {/* Show featured companies only if no search has been made */}
      {!hasSearched && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-300 mb-4">
            🌟 Featured Companies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {currentCompanies.map((company) => (
              <div
                key={company.organisasjonsnummer}
                className="p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer bg-gray-800"
                onClick={() => setSelectedCompany(company)}
              >
                <h2 className="font-bold text-blue-300 hover:underline">
                  {company.navn}
                </h2>
                <p className="text-sm text-gray-400">
                  📅 Founded: {company.stiftelsesdato || "N/A"}
                </p>
                <p className="text-sm text-gray-400">
                  🆔 Org. Number: {company.organisasjonsnummer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show CompanyModal when a company is clicked */}
      {selectedCompany && (
        <CompanyModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  );
};

export default SearchForm;
