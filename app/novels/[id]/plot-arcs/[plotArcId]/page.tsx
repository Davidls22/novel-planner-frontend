"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface PlotArc {
  id: number;
  name: string;
  description: string;
}

export default function PlotArcDetailPage() {
  const [arc, setArc] = useState<PlotArc | null>(null);
  const { id, plotArcId } = useParams(); 
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchPlotArc = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}api/novels/${id}/plot_arcs/${plotArcId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setArc(data);
      } else {
        console.log("Failed to fetch plot arc details");
      }
    };

    fetchPlotArc();
  }, [id, plotArcId]);

  if (!arc) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{arc.name}</h1>
      <p><strong>Description:</strong> {arc.description}</p>
    </div>
  );
}