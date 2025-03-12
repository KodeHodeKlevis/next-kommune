"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const KommuneList = () => {
  const [kommuner, setKommuner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const municipalitiesPerPage = 20;
  const router = useRouter();

  useEffect(() => {
    const fetchAllKommuneData = async (url, allKommuner = []) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        const fetchedKommuner = data._embedded?.kommuner || [];
        allKommuner = [...allKommuner, ...fetchedKommuner];

        // Check if there is a next page
        const nextPage = data._links?.next?.href;
        if (nextPage) {
          return fetchAllKommuneData(nextPage, allKommuner); // Recursively fetch next page
        }

        return allKommuner; // Return full dataset after fetching all pages
      } catch (err) {
        setError(err.message);
        return allKommuner; // Return what was fetched before error
      }
    };

    const fetchData = async () => {
      setLoading(true);
      const allMunicipalities = await fetchAllKommuneData(
        "https://data.brreg.no/enhetsregisteret/api/kommuner?size=100"
      );

      // Sort municipalities alphabetically by name (A-Z)
      allMunicipalities.sort((a, b) => a.navn.localeCompare(b.navn));

      setKommuner(allMunicipalities);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Pagination Logic (AFTER Sorting, i still dont know how this works)
  const indexOfLastMunicipality = currentPage * municipalitiesPerPage;
  const indexOfFirstMunicipality =
    indexOfLastMunicipality - municipalitiesPerPage;
  const currentMunicipalities = kommuner.slice(
    indexOfFirstMunicipality,
    indexOfLastMunicipality
  );

  // Handle Page Changes
  const nextPage = () => {
    if (currentPage < Math.ceil(kommuner.length / municipalitiesPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading)
    return (
      <p className="text-yellow-400 text-center text-lg">
        ⏳ Loading municipalities...
      </p>
    );
  if (error)
    return (
      <p className="text-red-500 text-center text-lg">⚠️ Error: {error}</p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">
        Norwegian Municipalities (A-Z)
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentMunicipalities.map((kommune) => (
          <div
            key={kommune.nummer}
            onClick={() => router.push(`/kommune/${kommune.nummer}`)}
            className="p-4 rounded-lg bg-gray-800 shadow-md cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105"
          >
            <h2 className="text-lg font-bold text-blue-300">{kommune.navn}</h2>
            <p className="text-sm text-gray-400">
              🏙️ Municipality Number: {kommune.nummer}
            </p>
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
              : "hover:bg-blue-600"
          }`}
        >
          ⬅ Previous
        </button>

        <span className="text-gray-300 text-lg">
          Page {currentPage} of{" "}
          {Math.ceil(kommuner.length / municipalitiesPerPage)}
        </span>

        <button
          onClick={nextPage}
          disabled={
            currentPage === Math.ceil(kommuner.length / municipalitiesPerPage)
          }
          className={`px-4 py-2 bg-blue-500 rounded ${
            currentPage === Math.ceil(kommuner.length / municipalitiesPerPage)
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600"
          }`}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default KommuneList;
