"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Scene {
  id: number;
  situation: string;
  task: string;
  action: string;
  result: string;
  conflict_type?: string;
  emotional_beat?: string;
  scene_goal?: string;
}

export default function SceneDetailPage() {
  const [scene, setScene] = useState<Scene | null>(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle for edit mode
  const [situation, setSituation] = useState('');
  const [task, setTask] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');
  const [conflictType, setConflictType] = useState('');
  const [emotionalBeat, setEmotionalBeat] = useState('');
  const [sceneGoal, setSceneGoal] = useState('');
  const { id, chapterId, sceneId } = useParams();
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchScene = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}api/novels/${id}/chapters/${chapterId}/scenes/${sceneId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setScene(data);
        setSituation(data.situation);
        setTask(data.task);
        setAction(data.action);
        setResult(data.result);
        setConflictType(data.conflict_type || '');
        setEmotionalBeat(data.emotional_beat || '');
        setSceneGoal(data.scene_goal || '');
      } else {
        console.log('Failed to fetch scene details');
      }
    };

    fetchScene();
  }, [id, chapterId, sceneId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const response = await fetch(
      `${API_BASE_URL}api/novels/${id}/chapters/${chapterId}/scenes/${sceneId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          situation,
          task,
          action,
          result,
          conflict_type: conflictType,
          emotional_beat: emotionalBeat,
          scene_goal: sceneGoal,
        }),
      }
    );

    if (response.ok) {
      const updatedScene = await response.json();
      setScene(updatedScene);
      setIsEditing(false); // Exit edit mode
    } else {
      alert('Failed to update scene');
    }
  };

  if (!scene) return <div>Loading...</div>;

  return (
    <div className="p-6 text-center">
      {isEditing ? (
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold mb-6">Edit Scene</h1>
          <form onSubmit={handleUpdate} className="w-full max-w-lg">
            <div className="form-control mb-4">
              <label className="label">Situation</label>
              <input
                type="text"
                className="input input-bordered"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">Task</label>
              <input
                type="text"
                className="input input-bordered"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">Action</label>
              <input
                type="text"
                className="input input-bordered"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">Result</label>
              <input
                type="text"
                className="input input-bordered"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">Conflict Type</label>
              <input
                type="text"
                className="input input-bordered"
                value={conflictType}
                onChange={(e) => setConflictType(e.target.value)}
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">Emotional Beat</label>
              <input
                type="text"
                className="input input-bordered"
                value={emotionalBeat}
                onChange={(e) => setEmotionalBeat(e.target.value)}
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">Scene Goal</label>
              <input
                type="text"
                className="input input-bordered"
                value={sceneGoal}
                onChange={(e) => setSceneGoal(e.target.value)}
              />
            </div>
            <button className="btn btn-success" type="submit">
              Save Scene
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
            <h1 className="text-3xl font-bold mb-4">Scene Details</h1>
            <p className="text-lg mb-2">
              <strong>Situation:</strong> {scene.situation}
            </p>
            <p className="text-lg mb-2">
              <strong>Task:</strong> {scene.task}
            </p>
            <p className="text-lg mb-2">
              <strong>Action:</strong> {scene.action}
            </p>
            <p className="text-lg mb-2">
              <strong>Result:</strong> {scene.result}
            </p>
            {scene.conflict_type && (
              <p className="text-lg mb-2">
                <strong>Conflict Type:</strong> {scene.conflict_type}
              </p>
            )}
            {scene.emotional_beat && (
              <p className="text-lg mb-2">
                <strong>Emotional Beat:</strong> {scene.emotional_beat}
              </p>
            )}
            {scene.scene_goal && (
              <p className="text-lg mb-2">
                <strong>Scene Goal:</strong> {scene.scene_goal}
              </p>
            )}
            <button
              className="btn btn-primary mt-4"
              onClick={() => setIsEditing(true)}
            >
              Edit Scene
            </button>
          </div>
        </>
      )}
    </div>
  );
}