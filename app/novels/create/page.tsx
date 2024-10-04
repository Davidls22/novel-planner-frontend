
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateNovelPage() {
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const response = await fetch('${API_BASE_URL}api/novels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, synopsis }),
    });

    if (response.ok) {
      router.push('/dashboard');
    } else {
      alert('Failed to create novel');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create a New Novel</h1>
      <form onSubmit={handleSubmit}>
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
          Create Novel
        </button>
      </form>
    </div>
  );
}