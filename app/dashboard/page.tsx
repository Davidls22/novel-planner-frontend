"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTrashAlt } from 'react-icons/fa'; // Import trash icon

interface Novel {
  id: number;
  title: string;
  synopsis: string;
}

export default function DashboardPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchNovels = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('${API_BASE_URL}api/novels', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        // Ensure that we are accessing the data correctly
        if (Array.isArray(result.data)) {
          setNovels(result.data); // Set novels to the data property
        } else {
          console.error("Expected an array but got:", result.data);
          setNovels([]); // Fallback to an empty array
        }
      } else {
        console.log('Failed to fetch novels');
      }
    };

    fetchNovels();
  }, []);

  const handleDeleteNovel = async (novelId: number) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}api/novels/${novelId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Update the novels list after deletion
      setNovels((prevNovels) => prevNovels.filter((novel) => novel.id !== novelId));
    } else {
      alert('Failed to delete novel');
    }
  };

  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className="hero bg-base-200 p-10 rounded-lg mb-10">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to Your Novel Planner!</h1>
            <p className="py-6 text-lg">Organize your stories, characters, and world-building elements all in one place.</p>
            <button className="btn btn-primary" onClick={() => router.push('/novels/create')}>
              Start a New Novel
            </button>
          </div>
        </div>
      </div>

      {/* Novels Section */}
      <h1 className="text-3xl font-bold mb-6">Your Novels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {novels.map((novel) => (
          <div key={novel.id} className="card bg-base-200 shadow-xl p-4">
            <div className="flex flex-col justify-between h-full">
              <div>
                <h2 className="text-xl font-bold">{novel.title}</h2>
                <p className="text-gray-600 mb-4">{novel.synopsis}</p>
              </div>
              <div className="flex justify-between items-center">
                <button
                  className="btn btn-secondary"
                  onClick={() => router.push(`/novels/${novel.id}`)}
                >
                  View Details
                </button>
                <FaTrashAlt
                  className="cursor-pointer text-red-500 text-2xl"
                  onClick={() => handleDeleteNovel(novel.id)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Goals Section */}
      <div className="mt-16 p-6 bg-primary text-primary-content rounded-lg text-center">
        <h2 className="text-4xl font-bold">Enhance Your Writing Journey!</h2>
        <p className="text-lg mt-4">
          Set your writing goals and track your overall progress across all your novels. Keep your creativity flowing!
        </p>
        <button className="btn btn-accent mt-6" onClick={() => router.push('/goals')}>
          View Your Writing Goals
        </button>
      </div>
    </div>
  );
}