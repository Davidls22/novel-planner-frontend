"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Novel {
  id: number;
  title: string;
  synopsis: string;
}

export default function NovelsPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchNovels = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}api/novels`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNovels(data);
      } else {
        console.log('Failed to fetch novels');
      }
    };

    fetchNovels();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Novels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {novels.map((novel) => (
          <div key={novel.id} className="card bg-base-200 shadow-xl p-4">
            <h2 className="text-xl font-bold">{novel.title}</h2>
            <p>{novel.synopsis}</p>
            <button
              className="btn btn-secondary mt-4"
              onClick={() => router.push(`/novels/${novel.id}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}