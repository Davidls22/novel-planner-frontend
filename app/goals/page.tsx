"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Goal {
  id: number;
  novel_title: string; // Novel title for each goal
  goal_type: string;
  target: number;
  current_progress: number;
  deadline: string | null;
  novel_id: number;
}

export default function GoalsOverviewPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}api/goals-overview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      } else {
        console.log("Failed to fetch goals");
      }
    };

    fetchGoals();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">Your Goals Overview</h1>
      <p className="text-lg mb-4">Track your progress across all novels.</p>

      {/* Display all goals across novels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <div key={goal.id} className="card bg-base-200 shadow-xl p-4">
            <h2 className="text-xl font-bold">{goal.novel_title}</h2>
            <p>Goal: {goal.goal_type}</p>
            <p>Target: {goal.target}</p>
            <p>Current Progress: {goal.current_progress}</p>
            {goal.deadline && <p>Deadline: {goal.deadline}</p>}
            <button
              className="btn btn-primary mt-4"
              onClick={() => router.push(`/novels/${goal.novel_id}/goals`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}