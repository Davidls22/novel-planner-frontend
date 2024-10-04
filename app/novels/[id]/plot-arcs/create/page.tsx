"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CreatePlotArcPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const { id } = useParams(); 
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}api/novels/${id}/plot_arcs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });

    if (response.ok) {
      router.push(`/novels/${id}/plot-arcs`);
    } else {
      alert("Failed to create plot arc");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create a New Plot Arc</h1>
      <form onSubmit={handleSubmit}>
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
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Create Plot Arc
        </button>
      </form>
    </div>
  );
}