"use client";

import React, { useState } from "react";
import SearchForm from "../../components/SearchForm";
import CompaniesList from "../../components/CompaniesList";

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (searchParams) => {
    let url = `https://data.brreg.no/enhetsregisteret/api/enheter?size=100`;
    if (searchParams.companyName) url += `&navn=${encodeURIComponent(searchParams.companyName)}`;
    if (searchParams.orgNumber) url += `&organisasjonsnummer=${searchParams.orgNumber}`;
    if (searchParams.industry) url += `&naeringskode1=${searchParams.industry}`;

    const response = await fetch(url);
    const data = await response.json();
    setCompanies(data._embedded?.enheter || []);
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <SearchForm onSearch={handleSearch} />
      <input
        type="text"
        placeholder="Filter results..."
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded mt-4"
      />
      <CompaniesList companies={companies.filter((c) =>
        c.navn.toLowerCase().includes(searchQuery.toLowerCase())
      )} />
    </div>
  );
};

export default CompaniesPage;
