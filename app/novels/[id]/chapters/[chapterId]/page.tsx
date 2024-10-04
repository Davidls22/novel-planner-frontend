"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaTrashAlt } from "react-icons/fa"; // Import trash icon

interface Chapter {
  id: number;
  title: string;
  synopsis: string;
  scenes: any[];
}

export default function ChapterDetailPage() {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const router = useRouter();
  const { id, chapterId } = useParams();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchChapter = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}api/novels/${id}/chapters/${chapterId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Ensure 'scenes' is an array
        setChapter({ ...data, scenes: data.scenes || [] });
      } else {
        console.log("Failed to fetch chapter details");
      }
    };

    fetchChapter();
  }, [id, chapterId]);

  const handleDeleteScene = async (sceneId: number) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_BASE_URL}api/novels/${id}/chapters/${chapterId}/scenes/${sceneId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      // Refresh chapter data after deletion
      setChapter((prevChapter) => ({
        ...prevChapter!,
        scenes: prevChapter!.scenes.filter((scene) => scene.id !== sceneId),
      }));
    } else {
      alert("Failed to delete scene");
    }
  };

  if (!chapter) return <div>Loading...</div>;

  return (
    <div className="p-6 text-center">
      <h1 className="text-5xl font-bold mb-6">{chapter.title}</h1>
      <p className="text-2xl mb-8">{chapter.synopsis}</p>

      {/* Scenes Section */}
      <hr className="my-8" />
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Scenes</h2>
          <button
            className="btn btn-secondary"
            onClick={() =>
              router.push(`/novels/${id}/chapters/${chapterId}/scenes/create`)
            }
          >
            Add Scene
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Define individual scenes within the chapter, highlighting key events
          or character interactions.
        </p>

        {/* Display scenes in cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapter.scenes && chapter.scenes.length > 0 ? (
            chapter.scenes.map((scene, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-xl p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold mb-2">Scene {index + 1}</h3>
                  <p className="text-sm">{scene.situation}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      router.push(
                        `/novels/${id}/chapters/${chapterId}/scenes/${scene.id}`
                      )
                    }
                  >
                    View Scene
                  </button>
                  <FaTrashAlt
                    className="cursor-pointer text-red-500 text-xl"
                    onClick={() => handleDeleteScene(scene.id)}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No scenes added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}