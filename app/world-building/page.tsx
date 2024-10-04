"use client";

import { useEffect, useState } from 'react';

interface WorldElement {
  id: number;
  name: string;
  type: string;
  novel: { title: string }; // Assuming each world element is linked to a novel
}

export default function AllWorldBuildingPage() {
  const [elements, setElements] = useState<WorldElement[]>([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchWorldElements = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('${API_BASE_URL}api/world-elements', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setElements(data);
      } else {
        console.log('Failed to fetch world elements');
      }
    };

    fetchWorldElements();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All World Building Elements</h1>
      <ul>
        {elements.map((element) => (
          <li key={element.id} className="mb-2">
            {element.name} - {element.type} in {element.novel.title}
          </li>
        ))}
      </ul>
    </div>
  );
}