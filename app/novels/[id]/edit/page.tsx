
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditNovelPage() {
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const router = useRouter();
  const { id } = useParams();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchNovel = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}api/novels/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTitle(data.title);
        setSynopsis(data.synopsis);
      } else {
        console.log('Failed to fetch novel details');
      }
    };

    fetchNovel();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}api/novels/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, synopsis }),
    });

    if (response.ok) {
      router.push(`/novels/${id}`);
    } else {
      alert('Failed to update novel');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Novel</h1>
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
          Update Novel
        </button>
      </form>
    </div>
  );
}