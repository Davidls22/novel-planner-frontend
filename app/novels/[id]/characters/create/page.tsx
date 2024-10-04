"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Goal {
    id: number;           // The ID of the goal
    title: string;        // The title of the goal
    goal_type: string;    // Type of the goal (e.g., "chapters")
    current_progress: number; // Current progress towards the goal
    // Add other properties as necessary
  }

export default function CreateCharacterPage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const { id } = useParams(); 
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const updateProgress = async () => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}api/novels/${id}/goals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const goalsResponse = await response.json(); // The complete response
      const goalsData = goalsResponse.data; // Access the goals data
      const characterGoal = goalsData.find((goal: Goal) => goal.goal_type === 'characters'); // Change the goal type accordingly
      
      if (characterGoal) {
        await fetch(`${API_BASE_URL}api/novels/${id}/goals/${characterGoal.id}`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_progress: characterGoal.current_progress + 1, // Increment progress
          }),
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}api/novels/${id}/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, role, description }),
    });

    if (response.ok) {
      await updateProgress(); // Update progress after creation
      router.push(`/novels/${id}`);
    } else {
      alert('Failed to create character');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Character</h1>
      <form onSubmit={handleSubmit}>
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
        <button className="btn btn-primary" type="submit">
          Add Character
        </button>
      </form>
    </div>
  );
}