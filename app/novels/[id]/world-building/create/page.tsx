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

export default function CreateWorldElementPage() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const { id } = useParams(); 
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Function to update the progress of the world-building goal
  const updateProgress = async () => {
    const token = localStorage.getItem("token");

    // Fetch goals associated with the novel
    const response = await fetch(`${API_BASE_URL}api/novels/${id}/goals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const goalsResponse = await response.json(); // The complete response
      const goalsData = goalsResponse.data; // Access the goals data
      const worldBuildingGoal = goalsData.find((goal: Goal) => goal.goal_type === 'world_building'); // Find world-building goal
      
      if (worldBuildingGoal) {
        // Update current_progress for the found world-building goal
        await fetch(`${API_BASE_URL}api/novels/${id}/goals/${worldBuildingGoal.id}`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_progress: worldBuildingGoal.current_progress + 1, // Increment progress
          }),
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}api/novels/${id}/world-elements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, type, description }),
    });

    if (response.ok) {
      await updateProgress(); // Call updateProgress after creating the world element
      router.push(`/novels/${id}/`);
    } else {
      alert('Failed to create world element');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Add New World Element</h1>
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
        <button className="btn btn-primary" type="submit">
          Add World Element
        </button>
      </form>
    </div>
  );
}