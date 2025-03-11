"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Municipality descriptions
const kommuneDescriptions = {
  1114: "Bjerkreim is known for its stunning natural landscapes and rich agricultural history.",
  1101: "Eigersund is a charming coastal town with a thriving fishing industry and beautiful fjords.",
  1122: "Gjesdal features breathtaking mountains and outdoor activities, perfect for hiking enthusiasts.",
  1106: "Haugesund is famous for its maritime history and vibrant cultural festivals.",
  1133: "Hjelmeland is a picturesque municipality with lush greenery and fjords, perfect for nature lovers.",
  1119: "Hå is a peaceful farming community with stunning beaches and historical landmarks.",
  1120: "Klepp is well known for its agricultural production and coastal beauty.",
  1144: "Kvitsøy is Norway’s smallest municipality, made up of beautiful small islands.",
  1112: "Lund offers a perfect mix of nature, history, and Norwegian cultural heritage.",
  "0301":
    "Oslo, the capital of Norway, is a vibrant city with world-class attractions and rich history.",
  1127: "Randaberg is a thriving community with scenic landscapes and a strong local economy.",
  1108: "Sandnes is a dynamic city with strong industry and easy access to beautiful nature.",
  1135: "Sauda is known for its skiing facilities, mountains, and beautiful fjords.",
  1111: "Sokndal has unique geological formations and stunning nature.",
  1124: "Sola is famous for its long sandy beaches and strong aviation industry.",
  1103: "Stavanger is a major oil city with a lively cultural scene and international influence.",
  1130: "Strand is a scenic municipality with strong ties to maritime history.",
  1134: "Suldal is known for its impressive waterfalls, hydropower production, and deep fjords.",
  1121: "Time is a municipality with a blend of rich cultural heritage and modern industry.",
  "0999":
    "Utenlands represents areas outside Norway and is used for administrative purposes.",
};

const KommuneDetails = () => {
  const { kommuneId } = useParams();
  const [kommune, setKommune] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!kommuneId) return;

    const fetchAllKommuneDetails = async () => {
      try {
        console.log(
          `🔍 Fetching all municipalities for kommuneId: ${kommuneId}`
        );

        let allKommuner = [];
        let page = 0;
        let totalPages = 1;

        while (page < totalPages) {
          const response = await fetch(
            `https://data.brreg.no/enhetsregisteret/api/kommuner?page=${page}&size=100`
          );
          if (!response.ok)
            throw new Error("❌ Failed to fetch municipality details");

          const data = await response.json();
          console.log(`📡 API Response (Page ${page}):`, data);

          if (data._embedded?.kommuner) {
            allKommuner = [...allKommuner, ...data._embedded.kommuner];
          }
          totalPages = data.totalPages;
          page++;
        }

        console.log("✅ Fetched All Municipalities:", allKommuner.length);

        // Find the selected municipality
        const foundKommune = allKommuner.find(
          (k) => String(k.nummer) === String(kommuneId)
        );
        console.log("✅ Matched Kommune:", foundKommune);

        if (foundKommune) {
          setKommune(foundKommune);
        } else {
          throw new Error("❌ Municipality not found in API response");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllKommuneDetails();
  }, [kommuneId]);

  if (loading)
    return (
      <p className="text-yellow-400">⏳ Loading municipality details...</p>
    );
  if (error) return <p className="text-red-500">⚠️ Error: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">
        {kommune?.navn}
      </h1>

      {/* Clickable Image with Proper Styling */}
      <a
        href={`/kommune-images/${kommune?.nummer}.jpg`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={`/kommune-images/${kommune?.nummer}.jpg`}
          onError={(e) => {
            e.target.src = "/kommune-images/default.jpg";
          }}
          alt={kommune?.navn}
          className="w-full max-w-[600px] h-auto object-cover rounded-lg shadow-lg mx-auto mb-6 cursor-pointer hover:scale-105 transition-transform"
        />
      </a>

      {/* Municipality Number */}
      <p className="text-lg text-gray-300 text-center">
        🏙️ Municipality Number: <strong>{kommune?.nummer}</strong>
      </p>

      {/* Municipality Description */}
      <p className="text-md text-gray-400 mt-4 text-center">
        {kommuneDescriptions[kommuneId] ||
          "No description available for this municipality."}
      </p>
    </div>
  );
};

export default KommuneDetails;
