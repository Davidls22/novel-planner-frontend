"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Character {
  id: number;
  name: string;
  role: string;
  description: string;
}

export default function CharacterDetailPage() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false); // Toggle for edit mode
  const { id, characterId } = useParams(); // Novel ID and Character ID
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCharacter = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}api/novels/${id}/characters/${characterId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCharacter(data);
        setName(data.name);
        setRole(data.role);
        setDescription(data.description);
      } else {
        console.log('Failed to fetch character details');
      }
    };

    fetchCharacter();
  }, [id, characterId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const response = await fetch(
      `${API_BASE_URL}api/novels/${id}/characters/${characterId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, role, description }),
      }
    );

    if (response.ok) {
      const updatedCharacter = await response.json();
      setCharacter(updatedCharacter);
      setIsEditing(false); // Turn off edit mode after update
    } else {
      alert('Failed to update character');
    }
  };

  if (!character) return <div>Loading...</div>;

  return (
    <div className="p-6 text-center">
      {isEditing ? (
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold mb-6">Edit Character</h1>
          <form onSubmit={handleUpdate} className="w-full max-w-lg">
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
              <label className="label">Role</label>
              <input
                type="text"
                className="input input-bordered"
                value={role}
                onChange={(e) => setRole(e.target.value)}
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
              Save Character
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
            <h1 className="text-3xl font-bold mb-4">{character.name}</h1>
            <p className="text-lg mb-2">Role: {character.role}</p>
            <p className="text-lg mb-4">{character.description}</p>
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Character
            </button>
          </div>
        </>
      )}
    </div>
  );
}