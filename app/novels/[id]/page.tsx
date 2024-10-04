"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaTrashAlt } from "react-icons/fa"; // Import trash icon

interface Novel {
  id: number;
  title: string;
  synopsis: string;
}

interface Chapter {
  id: number;
  title: string;
  chapter_number: number;
  synopsis: string;
}

interface Character {
  id: number;
  name: string;
}

interface WorldElement {
  id: number;
  name: string;
  type: string;
}

interface Location {
  id: number;
  name: string;
  description: string;
}

export default function NovelDetailPage() {
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [worldElements, setWorldElements] = useState<WorldElement[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isEditing, setIsEditing] = useState(false); 
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const router = useRouter();
  const { id } = useParams(); 
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchNovel = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}api/novels/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNovel(data.data);
        setTitle(data.title);
        setSynopsis(data.synopsis);
      } else {
        console.log("Failed to fetch novel details");
      }
    };

    const fetchChapters = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}api/novels/${id}/chapters`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setChapters(data);
      } else {
        console.log("Failed to fetch chapters");
      }
    };

    const fetchCharacters = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}api/novels/${id}/characters`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCharacters(data);
      } else {
        console.log("Failed to fetch characters");
      }
    };

    const fetchWorldElements = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}api/novels/${id}/world-elements`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWorldElements(data);
      } else {
        console.log("Failed to fetch world-building elements");
      }
    };

    const fetchLocations = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}api/novels/${id}/locations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      } else {
        console.log("Failed to fetch locations");
      }
    };

    fetchNovel();
    fetchChapters();
    fetchCharacters();
    fetchWorldElements();
    fetchLocations();
  }, [id]);

  const handleDelete = async (type: string, itemId: number) => {
    const token = localStorage.getItem("token");
    let endpoint = `${API_BASE_URL}api/novels/${id}`;

    switch (type) {
      case "chapter":
        endpoint += `/chapters/${itemId}`;
        break;
      case "character":
        endpoint += `/characters/${itemId}`;
        break;
      case "worldElement":
        endpoint += `/world-elements/${itemId}`;
        break;
      case "location":
        endpoint += `/locations/${itemId}`;
        break;
      default:
        return;
    }

    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Reload data after deletion
      window.location.reload();
    } else {
      console.log("Failed to delete item");
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}api/novels/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, synopsis }),
    });

    if (response.ok) {
      setIsEditing(false);
      const data = await response.json();
      setNovel(data);
    } else {
      console.log("Failed to update novel");
    }
  };

  if (!novel) return <div>Loading...</div>;

  return (
    <div className="p-6 text-center">
      {isEditing ? (
        <div className="flex flex-col items-center mb-6">
          <input
            className="input input-lg mb-4 w-full max-w-xl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="textarea textarea-lg mb-4 w-full max-w-xl"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleSave}>
            Save
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-5xl font-bold mb-6">{novel.title}</h1>
          <p className="text-2xl mb-8">{novel.synopsis}</p>
          <button
            className="btn btn-primary mb-4"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <div className="flex justify-center mb-4">
            <button
              className="btn btn-accent"
              onClick={() => router.push(`/novels/${novel.id}/goals`)}
            >
              Set Goals + View Progress
            </button>
          </div>
        </>
      )}

      {/* Sections: Chapters, Characters, World Building, Locations */}
      <hr className="my-8" />
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Chapters</h2>
          <p className="text-sm text-gray-500">
            Provide a number to represent the chapter order, a short summary of
            the chapter, and add key scenes that unfold within it.
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => router.push(`/novels/${novel.id}/chapters/create`)}
          >
            Add Chapter
          </button>
        </div>

        {/* Sort chapters by chapterNumber before rendering */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters
            .sort((a, b) => (a.chapter_number || 0) - (b.chapter_number || 0)) // Sort by chapter_number
            .map((chapter) => (
              <div
                key={chapter.id}
                className="card bg-base-100 shadow-xl p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold mb-2">
                    Chapter {chapter.chapter_number || "Unnumbered"}:{" "}
                    {chapter.title}
                  </h3>
                  <p className="text-sm">{chapter.synopsis}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() =>
                      router.push(`/novels/${novel.id}/chapters/${chapter.id}`)
                    }
                  >
                    View
                  </button>
                  <FaTrashAlt
                    className="cursor-pointer text-2xl text-red-500"
                    onClick={() => handleDelete("chapter", chapter.id)}
                  />
                </div>
              </div>
            ))}
        </div>
        {/* Characters Section */}
        <hr className="my-8" />
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Characters</h2>
            <p className="text-sm text-gray-500">
              Enter the names of key characters and their roles in the story
              (e.g., protagonist, antagonist).
            </p>
            <button
              className="btn btn-secondary"
              onClick={() =>
                router.push(`/novels/${novel.id}/characters/create`)
              }
            >
              Add Character
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((character) => (
              <div
                key={character.id}
                className="card bg-base-100 shadow-xl p-4 flex items-center justify-between"
              >
                <h3 className="text-lg font-bold mb-2">{character.name}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() =>
                      router.push(
                        `/novels/${novel.id}/characters/${character.id}`
                      )
                    }
                  >
                    View
                  </button>
                  <FaTrashAlt
                    className="cursor-pointer text-2xl text-red-500"
                    onClick={() => handleDelete("character", character.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* World Building Section */}
        <hr className="my-8" />
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">World Building Elements</h2>
            <p className="text-sm text-gray-500">
              Define different worldbuilding aspects such as geography, magic
              systems, cultures, and key historical events.
            </p>
            <button
              className="btn btn-secondary"
              onClick={() =>
                router.push(`/novels/${novel.id}/world-building/create`)
              }
            >
              Add World Element
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {worldElements.map((element) => (
              <div
                key={element.id}
                className="card bg-base-100 shadow-xl p-4 flex items-center justify-between"
              >
                <h3 className="text-lg font-bold mb-2">
                  {element.name} - {element.type}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() =>
                      router.push(
                        `/novels/${novel.id}/world-building/${element.id}`
                      )
                    }
                  >
                    View
                  </button>
                  <FaTrashAlt
                    className="cursor-pointer text-2xl text-red-500"
                    onClick={() => handleDelete("worldElement", element.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Locations Section */}
        <hr className="my-8" />
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Locations</h2>
            <p className="text-sm text-gray-500">
              List key locations in the story, such as cities, magical places,
              or important landmarks.
            </p>
            <button
              className="btn btn-secondary"
              onClick={() =>
                router.push(`/novels/${novel.id}/locations/create`)
              }
            >
              Add Location
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <div
                key={location.id}
                className="card bg-base-100 shadow-xl p-4 flex items-center justify-between"
              >
                <h3 className="text-lg font-bold mb-2">{location.name}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() =>
                      router.push(
                        `/novels/${novel.id}/locations/${location.id}`
                      )
                    }
                  >
                    View
                  </button>
                  <FaTrashAlt
                    className="cursor-pointer text-2xl text-red-500"
                    onClick={() => handleDelete("location", location.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

       
      </div>
    </div>
  );
}
