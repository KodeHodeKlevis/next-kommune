"use client";

import React, { useState, useEffect } from "react";
import SearchForm from "../../components/SearchForm";
import CompanyModal from "../../components/CompanyModal";

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 12; 

  // Fetch companies recursively with pagination handling
  const fetchAllCompanies = async (url, allCompanies = [], attempt = 1) => {
    if (attempt > 10) return allCompanies;

    try {
      console.log(`🔎 Fetching: ${url} (Attempt: ${attempt})`);
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

      const data = await response.json();
      const newCompanies = data._embedded?.enheter || [];
      allCompanies = [...allCompanies, ...newCompanies];

      console.log(`✅ Fetched ${newCompanies.length} companies (Total: ${allCompanies.length})`);

      // Stop if no more pages
      const nextPage = data._links?.next?.href;
      if (!nextPage || newCompanies.length === 0) return allCompanies;

      return fetchAllCompanies(nextPage, allCompanies, attempt + 1);
    } catch (err) {
      console.error("❌ Error fetching companies:", err);
      return allCompanies;
    }
  };

  // Handle search and update state
  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentPage(1); // Reset pagination when searching

    if (!searchParams.municipality) {
      setError("❌ Please select a municipality.");
      setLoading(false);
      return;
    }

    let baseUrl = `https://data.brreg.no/enhetsregisteret/api/enheter?size=100&kommunenummer=${searchParams.municipality}`;
    if (searchParams.companyName) baseUrl += `&navn=${encodeURIComponent(searchParams.companyName)}`;
    if (searchParams.orgNumber) baseUrl += `&organisasjonsnummer=${searchParams.orgNumber}`;
    if (searchParams.industry) baseUrl += `&naeringskode1=${searchParams.industry}`;

    try {
      const allCompanies = await fetchAllCompanies(baseUrl);
      setCompanies(allCompanies);
    } catch (err) {
      setError("⚠️ Failed to fetch company data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic (again, no idea how this works)
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = companies.slice(indexOfFirstCompany, indexOfLastCompany);

  const nextPage = () => {
    if (currentPage < Math.ceil(companies.length / companiesPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      {/* Pass hasSearched to hide featured companies */}
      <SearchForm onSearch={handleSearch} hasSearched={hasSearched} />

      {/* Loading & Error Messages */}
      {loading && <p className="text-yellow-400 mt-4 text-center">⏳ Loading...</p>}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {/* Display Companies */}
      {hasSearched && (
        <div className="mt-6">
          {companies.length === 0 && !loading ? (
            <p className="text-gray-400 text-center">❌ No companies found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentCompanies.map((company) => (
                  <div
                    key={company.organisasjonsnummer}
                    className={`p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer ${
                      company.konkurs ? "bg-red-600 text-white" : "bg-gray-800"
                    }`}
                    onClick={() => setSelectedCompany(company)}
                  >
                    <h2 className="font-bold text-blue-300 hover:underline">{company.navn}</h2>
                    <p className="text-sm text-gray-400">📅 Founded: {company.stiftelsesdato || "N/A"}</p>
                    <p className="text-sm text-gray-400">🆔 Org. Number: {company.organisasjonsnummer}</p>
                    {company.konkurs && <p className="text-yellow-300 font-bold mt-2">⚠️ Bankrupt</p>}
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 bg-blue-500 rounded ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-600 cursor-pointer"
                  }`}
                >
                  ⬅ Previous
                </button>

                <span className="text-gray-300 text-lg">
                  Page {currentPage} of {Math.ceil(companies.length / companiesPerPage)}
                </span>

                <button
                  onClick={nextPage}
                  disabled={currentPage === Math.ceil(companies.length / companiesPerPage)}
                  className={`px-4 py-2 bg-blue-500 rounded ${
                    currentPage === Math.ceil(companies.length / companiesPerPage)
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-600 cursor-pointer"
                  }`}
                >
                  Next ➡
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Show CompanyModal when a company is clicked */}
      {selectedCompany && <CompanyModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />}
    </div>
  );
};

export default CompaniesPage;
