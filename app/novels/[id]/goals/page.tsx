"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Bar } from "react-chartjs-2"; // Import Bar chart
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"; // Import necessary components

// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Goal {
  id: number;
  goal_type: string; // 'chapters', 'scenes', 'characters', 'world_building'
  target: number;
  current_progress: number;
  deadline: string | null;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalType, setGoalType] = useState("chapters");
  const [target, setTarget] = useState<number>(0);
  const [deadline, setDeadline] = useState<string | null>(null);
  const { id } = useParams(); // Novel ID
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}api/novels/${id}/goals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (Array.isArray(result.data)) {
          setGoals(result.data); // Set goals from the data property
        } else {
          console.error("Expected an array of goals but got:", result.data);
          setGoals([]); // Set empty array if the response is not as expected
        }
      } else {
        console.log("Failed to fetch goals");
      }
    };

    fetchGoals();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}api/novels/${id}/goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ goal_type: goalType, target, deadline, novel_id: id }),
    });

    if (response.ok) {
      const newGoal = await response.json();
      setGoals([...goals, newGoal]);
      setTarget(0); // Reset form
      setDeadline(null);
    } else {
      console.log("Failed to create goal");
    }
  };

  const progressData = {
    labels: goals.map((goal) => goal.goal_type), // Labels for the bar chart
    datasets: [
      {
        label: "Current Progress",
        data: goals.map((goal) => goal.current_progress),
        backgroundColor: goals.map((goal) => 
          goal.current_progress >= goal.target ? "green" : "rgba(75, 192, 192, 0.6)"
        ),
      },
      {
        label: "Target",
        data: goals.map((goal) => goal.target),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-4xl font-bold mb-6">Set Your Planning Goals</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side: Add Goals Form */}
        <div className="flex-2 bg-base-200 p-4 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="form-control mb-4">
              <label className="label">Goal Type</label>
              <select
                value={goalType}
                onChange={(e) => setGoalType(e.target.value)}
                className="select select-bordered"
              >
                <option value="chapters">Chapters</option>
                <option value="scenes">Scenes</option>
                <option value="characters">Characters</option>
                <option value="world_building">World Building</option>
              </select>
            </div>

            <div className="form-control mb-4">
              <label className="label">Target</label>
              <input
                type="number"
                className="input input-bordered"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">Deadline (optional)</label>
              <input
                type="date"
                className="input input-bordered"
                value={deadline || ""}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" type="submit">
              Set Goal
            </button>
          </form>

          {/* Display Existing Goals */}
          <div className="grid grid-cols-1 gap-4">
            {goals.length > 0 ? (
              goals.map((goal) => (
                <div key={goal.id} className="card bg-base-200 shadow-xl p-4">
                  <h2 className="text-xl font-bold">{goal.goal_type}</h2>
                  <p>Target: {goal.target}</p>
                  <p>Current Progress: {goal.current_progress}</p>
                  {goal.deadline && <p>Deadline: {goal.deadline}</p>}
                  {goal.current_progress >= goal.target && (
                    <p className="text-green-500">Goal Completed!</p>
                  )}
                </div>
              ))
            ) : (
              <p>No goals available.</p>
            )}
          </div>
        </div>

        {/* Right Side: Progress Chart */}
        <div className="flex-1 bg-base-200 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Progress Tracking</h2>
          {goals.length > 0 ? <Bar data={progressData} /> : <p>No goals to display.</p>}
        </div>
      </div>
    </div>
  );
}