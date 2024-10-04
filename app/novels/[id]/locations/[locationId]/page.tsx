"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Location {
  id: number;
  name: string;
  description: string;
}

export default function LocationDetailPage() {
  const [location, setLocation] = useState<Location | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const { id, locationId } = useParams(); // Novel and Location IDs
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchLocation = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}api/novels/${id}/locations/${locationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLocation(data);
        setName(data.name);
        setDescription(data.description);
      } else {
        console.log("Failed to fetch location details");
      }
    };

    fetchLocation();
  }, [id, locationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}api/novels/${id}/locations/${locationId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
        }),
      }
    );

    if (response.ok) {
      const updatedLocation = await response.json();
      setLocation(updatedLocation);
      setIsEditing(false); // Turn off edit mode after successful update
    } else {
      alert("Failed to update location");
    }
  };

  if (!location) return <div>Loading...</div>;

  return (
    <div className="p-6 text-center">
      {isEditing ? (
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold mb-6">Edit Location</h1>
          <form onSubmit={handleSubmit} className="w-full max-w-lg">
            <div className="form-control mb-4">
              <label className="label">Name</label>
              <input
                type="text"
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">Description</label>
              <textarea
                className="textarea textarea-bordered"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <button className="btn btn-success" type="submit">
              Save Location
            </button>
            <button
              className="btn btn-secondary ml-4"
              onClick={() => setIsEditing(false)}
              type="button"
            >
              Cancel
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="card bg-base-100 shadow-xl p-6 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">{location.name}</h1>
            <p className="text-lg mb-4">{location.description}</p>
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Location
            </button>
          </div>
        </>
      )}
    </div>
  );
}