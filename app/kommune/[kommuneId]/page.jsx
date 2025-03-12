"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const MunicipalityDetails = () => {
  const { kommuneId } = useParams(); // Get the municipality ID from the URL
  const router = useRouter();
  const [municipality, setMunicipality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!kommuneId) return;

    const fetchMunicipalityDetails = async () => {
      try {
        const response = await axios.get(
          `https://data.brreg.no/enhetsregisteret/api/kommuner/${kommuneId}`
        );

        setMunicipality(response.data);
      } catch (err) {
        console.error("❌ Error fetching municipality details:", err);
        setError("Failed to load municipality details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipalityDetails();
  }, [kommuneId]);

  if (loading)
    return <p className="text-yellow-400 text-center">⏳ Loading details...</p>;
  if (error) return <p className="text-red-500 text-center">⚠️ {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">
        {municipality?.navn}
      </h1>

      <div className="space-y-4 text-gray-300">
        <p className="text-lg">
          🏙️ Municipality Number: {municipality?.nummer}
        </p>
        {/* Add additional data if available */}
        {municipality?.areal && <p>🌍 Area: {municipality.areal} km²</p>}
        {municipality?.befolkning && (
          <p>👥 Population: {municipality.befolkning}</p>
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mt-6 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
      >
        ⬅ Back to List
      </button>
    </div>
  );
};

export default MunicipalityDetails;
