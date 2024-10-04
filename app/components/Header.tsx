"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [user, setUser] = useState<string | null>(null); // User's name
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    // Fetch user data from the /api/user endpoint
    const token = localStorage.getItem('token');
    const fetchUserData = async () => {
      const response = await fetch(`${API_BASE_URL}api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.name); // Assuming the user's name is returned
      } else {
        console.error('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Clear token and redirect to login
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="navbar bg-base-100">
      <div className="flex-1">
        <Link href="/dashboard" className="btn btn-ghost normal-case text-xl">
          Novel Planner
        </Link>
      </div>
      <div className="flex-none">
        <div className="flex items-center space-x-4">
          {user && <span>{user}</span>}
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;