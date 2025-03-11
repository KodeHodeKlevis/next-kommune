"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const KommuneList = () => {
  const [kommuneData, setKommuneData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchKommuneData = async () => {
      try {
        const response = await fetch(
          "https://data.brreg.no/enhetsregisteret/api/kommuner"
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();

        if (
          data._embedded?.kommuner &&
          Array.isArray(data._embedded.kommuner)
        ) {
          const sortedMunicipalities = data._embedded.kommuner.sort((a, b) =>
            a.navn.localeCompare(b.navn, "nb")
          );
          setKommuneData(sortedMunicipalities);
        } else {
          throw new Error("Unexpected API response format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKommuneData();
  }, []);

  const handleClick = (kommune) => {
    router.push(`/kommune/${kommune.nummer}`);
  };

  if (loading)
    return <p className="text-yellow-400">⏳ Loading municipalities...</p>;
  if (error) return <p className="text-red-500">⚠️ Error: {error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">
        List of Municipalities in Norway
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {kommuneData.map((kommune) => (
          <div
            key={kommune.nummer}
            onClick={() => handleClick(kommune)}
            className="border border-gray-700 p-4 rounded-lg bg-gray-800 shadow-md hover:bg-blue-500 hover:shadow-xl hover:scale-105 transition cursor-pointer"
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
