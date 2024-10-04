"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Location {
  id: number;
  name: string;
  description: string;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const router = useRouter();
  const { id } = useParams(); 
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchLocations = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}api/novels/${id}/locations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      } else {
        console.log("Failed to fetch locations");
      }
    };

    fetchLocations();
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Locations</h1>
      <button
        className="btn btn-primary mb-4"
        onClick={() => router.push(`/novels/${id}/locations/create`)}
      >
        Add Location
      </button>
      {locations.length > 0 ? (
        <ul>
          {locations.map((location) => (
            <li key={location.id} className="mb-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => router.push(`/novels/${id}/locations/${location.id}`)}
              >
                {location.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No locations added yet.</p>
      )}
    </div>
  );
}