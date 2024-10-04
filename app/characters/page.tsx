"use client";

import { useEffect, useState } from 'react';

interface Character {
  id: number;
  name: string;
  role: string;
  novel: { title: string };
}

export default function AllCharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCharacters = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}api/characters`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCharacters(data);
      } else {
        console.log('Failed to fetch characters');
      }
    };

    fetchCharacters();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Characters</h1>
      <ul>
        {characters.map((character) => (
          <li key={character.id} className="mb-2">
            {character.name} - {character.role} in {character.novel.title}
          </li>
        ))}
      </ul>
    </div>
  );
}