"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface WorldElement {
  id: number;
  name: string;
  type: string;
  description: string;
}

export default function WorldBuildingPage() {
  const [elements, setElements] = useState<WorldElement[]>([]);
  const router = useRouter();
  const { id } = useParams(); 
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchWorldElements = async () => {
      const token = localStorage.getItem('token');

      // Log the novel ID and token to ensure they are correctly retrieved
      console.log('Novel ID:', id);
      console.log('Token:', token);

      if (!token) {
        console.log('Token is missing!');
        return; // Stop if no token is found
      }

      try {
        const response = await fetch(`${API_BASE_URL}api/novels/${id}/world-elements`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Log the response status and URL
        console.log('Response status:', response.status);
        console.log('Request URL:', `${API_BASE_URL}api/novels/${id}/world-elements`);

        if (response.ok) {
          const data = await response.json();
          setElements(data);

          // Log the data to ensure it's fetched correctly
          console.log('World elements:', data);
        } else {
          console.log('Failed to fetch world elements:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching world elements:', error);
      }
    };

    fetchWorldElements();
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">World Elements</h1>
      <button
        className="btn btn-primary mb-4"
        onClick={() => router.push(`/novels/${id}/`)}
      >
        Add World Element
      </button>
      {elements.length > 0 ? (
        <ul>
          {elements.map((element) => (
            <li key={element.id} className="mb-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => router.push(`/novels/${id}/world-building/${element.id}`)}
              >
                {element.name} - {element.type}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No world elements added yet.</p>
      )}
    </div>
  );
}