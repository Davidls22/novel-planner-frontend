"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface PlotArc {
  id: number;
  name: string;
  description: string;
}

export default function PlotArcsPage() {
  const [plotArcs, setPlotArcs] = useState<PlotArc[]>([]);
  const router = useRouter();
  const { id } = useParams();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchPlotArcs = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}api/novels/${id}/plot_arcs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPlotArcs(data);
      } else {
        console.log("Failed to fetch plot arcs");
      }
    };

    fetchPlotArcs();
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Plot Arcs</h1>
      <button
        className="btn btn-primary mb-4"
        onClick={() => router.push(`/novels/${id}/plot-arcs/create`)}
      >
        Add Plot Arc
      </button>
      {plotArcs.length > 0 ? (
        <ul>
          {plotArcs.map((arc) => (
            <li key={arc.id} className="mb-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => router.push(`/novels/${id}/plot-arcs/${arc.id}`)}
              >
                {arc.name} - {arc.description}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No plot arcs added yet.</p>
      )}
    </div>
  );
}