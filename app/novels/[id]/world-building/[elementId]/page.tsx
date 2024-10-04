"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface WorldElement {
  id: number;
  name: string;
  type: string;
  description: string;
}

export default function WorldElementDetailPage() {
  const [element, setElement] = useState<WorldElement | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const { id, elementId } = useParams();
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchWorldElement = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}api/novels/${id}/world-elements/${elementId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setElement(data);
        setName(data.name);
        setType(data.type);
        setDescription(data.description);
      } else {
        console.log('Failed to fetch world element details');
      }
    };

    fetchWorldElement();
  }, [id, elementId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const response = await fetch(
      `${API_BASE_URL}api/novels/${id}/world-elements/${elementId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          type,
          description,
        }),
      }
    );

    if (response.ok) {
      const updatedElement = await response.json();
      setElement(updatedElement);
      setIsEditing(false); // Turn off edit mode after successful update
    } else {
      console.log('Failed to update world element');
    }
  };

  if (!element) return <div>Loading...</div>;

  return (
    <div className="p-6 text-center">
      {isEditing ? (
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold mb-6">Edit World Element</h1>
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
              <label className="label">Type</label>
              <input
                type="text"
                className="input input-bordered"
                value={type}
                onChange={(e) => setType(e.target.value)}
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
              Save World Element
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
            <h1 className="text-3xl font-bold mb-4">{element.name}</h1>
            <p className="text-lg mb-2">Type: {element.type}</p>
            <p className="text-lg mb-4">{element.description}</p>
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit World Element
            </button>
          </div>
        </>
      )}
    </div>
  );
}