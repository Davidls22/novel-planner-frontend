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

export default function CreateChapterPage() {
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [chapterNumber, setChapterNumber] = useState<number | string>(''); // State for chapter number
  const router = useRouter();
  const { id } = useParams();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const updateProgress = async () => {
    const token = localStorage.getItem('token');

    // Fetch goals associated with the novel
    const response = await fetch(`${API_BASE_URL}api/novels/${id}/goals`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const goalsResponse = await response.json(); // The complete response
      const goalsData = goalsResponse.data; // Access the goals data
      const chapterGoal = goalsData.find((goal: Goal) => goal.goal_type === 'chapters'); 
      
      if (chapterGoal) {
        // Update current_progress for the found chapter goal
        await fetch(`${API_BASE_URL}api/novels/${id}/goals/${chapterGoal.id}`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_progress: chapterGoal.current_progress + 1, // Increment progress
          }),
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}api/novels/${id}/chapters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, synopsis, chapter_number: chapterNumber }), // Send chapter_number in request body
    });

    if (response.ok) {
      await updateProgress(); // Update progress after creation
      router.push(`/novels/${id}`);
    } else {
      alert('Failed to create chapter');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create a New Chapter</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-control mb-4">
          <label className="label">Chapter Number</label> 
          <input
            type="number"
            className="input input-bordered"
            value={chapterNumber}
            onChange={(e) => setChapterNumber(Number(e.target.value))}
            required
          />
        </div>
        <div className="form-control mb-4">
          <label className="label">Title</label>
          <input
            type="text"
            className="input input-bordered"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-control mb-4">
          <label className="label">Synopsis</label>
          <textarea
            className="textarea textarea-bordered"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            required
          ></textarea>
        </div>
        <button className="btn btn-primary" type="submit">
          Create Chapter
        </button>
      </form>
    </div>
  );
}