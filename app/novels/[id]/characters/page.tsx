"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Character {
  id: number;
  name: string;
  role: string;
  description: string;
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const router = useRouter();
  const { id } = useParams(); 
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCharacters = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}api/novels/${id}/characters`, {
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
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Characters</h1>
      <button
        className="btn btn-primary mb-4"
        onClick={() => router.push(`/novels/${id}/characters/create`)}
      >
        Add Character
      </button>
      {characters.length > 0 ? (
        <ul>
          {characters.map((character) => (
            <li key={character.id} className="mb-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => router.push(`/novels/${id}/characters/${character.id}`)}
              >
                {character.name} - {character.role}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No characters added yet.</p>
      )}
    </div>
  );
}