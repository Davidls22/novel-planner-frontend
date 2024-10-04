"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function CreateScenePage() {
  const [description, setDescription] = useState('');
  const [situation, setSituation] = useState('');
  const [task, setTask] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');
  const router = useRouter();
  const { id, chapterId } = useParams(); 
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const response = await fetch(
      `${API_BASE_URL}api/novels/${id}/chapters/${chapterId}/scenes`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description,
          situation,
          task,
          action,
          result,
        }),
      }
    );

    const responseData = await response.json(); // Parse the response
  console.log(responseData);

    if (response.ok) {
      router.push(`/novels/${id}/chapters/${chapterId}`);
    } else {
      alert('Failed to create scene');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create a New Scene</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-control mb-4">
          <label className="label">Description</label>
          <input
            type="text"
            className="input input-bordered"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-control mb-4">
          <label className="label">Situation</label>
          <textarea
            className="textarea textarea-bordered"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-control mb-4">
          <label className="label">Task</label>
          <textarea
            className="textarea textarea-bordered"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-control mb-4">
          <label className="label">Action</label>
          <textarea
            className="textarea textarea-bordered"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-control mb-4">
          <label className="label">Result</label>
          <textarea
            className="textarea textarea-bordered"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            required
          ></textarea>
        </div>
        <button className="btn btn-primary" type="submit">
          Create Scene
        </button>
      </form>
    </div>
  );
}