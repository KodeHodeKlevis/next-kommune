"use client";

import React, { useState, useEffect } from "react";

const KommuneList = () => {
  const [kommuneData, setKommuneData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKommuneData = async () => {
      try {
        const response = await fetch(
          "https://data.brreg.no/enhetsregisteret/api/kommuner"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log("Kommune API Response:", data); // Debugging log

        // Extract data and ensure all municipalities are included
        let allKommuner = [];
        if (
          data._embedded?.kommuner &&
          Array.isArray(data._embedded.kommuner)
        ) {
          allKommuner = data._embedded.kommuner;
        } else {
          throw new Error("Unexpected API response format");
        }

        // 🔹 Sort the municipalities alphabetically by name
        allKommuner.sort((a, b) => a.navn.localeCompare(b.navn, "nb"));

        setKommuneData(allKommuner);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKommuneData();
  }, []);

  if (loading) return <p className="text-yellow-400">⏳ Loading kommunes...</p>;
  if (error) return <p className="text-red-500">⚠️ Error: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">
        List of Municipalities in Norway
      </h1>

      {/* Kommune Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kommuneData.map((kommune) => (
          <div
            key={kommune.nummer}
            className="border border-gray-700 p-4 rounded-lg bg-gray-800 shadow-md hover:shadow-lg transition"
          >
            <h2 className="font-bold text-blue-300">{kommune.navn}</h2>
            <p className="text-sm text-gray-400">
              🆔 Municipality Number: {kommune.nummer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KommuneList;
