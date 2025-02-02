"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import SpreadsheetView from "../components/SpreadsheetView";
import { ArrowDown, ArrowUpRight, CornerDownLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type Assignment = {
  task: string;
  agents: string[];
  cost: number;
  team: string;
};

export default function Home() {
  let [teamCount, setTeamCount] = useState(1);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [showSpreadsheet, setShowSpreadsheet] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [optimalAssignments, setOptimalAssignments] = useState<Assignment[]>(
    []
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setJsonFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!jsonFile) return;
    setShowSpreadsheet(true);
    const reader = new FileReader();
    reader.readAsText(jsonFile);
    reader.onload = async () => {
      try {
        const jsonData = JSON.parse(reader.result as string);
        setEvents(jsonData.events);

        const response = await fetch("/api/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: jsonData, teamCount }),
        });

        if (!response.ok) throw new Error("Failed to fetch assignments");

        const assignments = await response.json();
        setOptimalAssignments(assignments);
        toast.success(
          `Assigned events for ${teamCount} team${teamCount > 1 ? "s" : ""}!`
        );
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("There was an error while processing the file.");
      }
    };
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && jsonFile) {
        event.preventDefault();
        handleSubmit();
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleSubmit, jsonFile]);

  const teamOptions = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(5,5,32,255))]">
      <Toaster />
      <header className="border-b border-gray-600">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-gray-300">
                  Sciflow
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/pages/about"
                  className="text-gray-300 hover:text-gray-100 px-3 py-2 text-sm font-medium"
                >
                  About
                </Link>
                <Link
                  href="/pages/support"
                  className="text-gray-300 hover:text-gray-100 px-3 py-2 text-sm font-medium"
                >
                  Support
                </Link>
              </div>
            </div>
          </nav>
        </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl lg:text-6xl font-medium text-stone-100 tracking-tight leading-none">
            <span className="block text-slate-200">
              Sciflow, the next generation of
            </span>
            <span className="mt-2 p-2 font-medium block text-6xl lg:text-7xl bg-gradient-to-r from-violet-500 via-pink-400 to-amber-200 text-transparent bg-clip-text transform transition-transform duration-300 hover:scale-105">
              Science Olympiad
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            A delightfuly smart team management platform.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="flex justify-center">
              <button className={styles.button}>
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white group-hover:w-full group-hover:h-full opacity-10"></span>
                <span className="relative">Get Started</span>
              </button>
            </div>
            <div className="flex items-center y-2 px-4 font-medium rounded-md text-slate-300 outline outline-1 outline-gray-500 bg-gradient-to-t from-gray-800 to-[#050520] hover:text-slate-200">
              Learn More
            </div>
          </div>
        </div>

        <div
          id="get-started"
          className="max-w-3xl mx-auto rounded-2xl p-10 space-y-8 border border-gray-700 flex flex-col items-center"
        >
          <div className="flex">
            <div>
              <label
                htmlFor="jsonFile"
                className="block text-lg font-medium text-gray-300"
              >
                Upload Team Data
              </label>
              <p className="text-xs text-gray-400 mb-3">
                <Link
                  href="/pages/support/"
                  className="hover:text-gray-100 transition-colors inline-flex items-center"
                >
                  Learn how to create data
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </p>
              <input
                type="file"
                id="jsonFile"
                accept=".json"
                onChange={handleFileChange}
                className="text-sm outline-none ring-none file:border file:border-gray-700 file:outline-2 file:hover:text-gray-200 file:w-32 file:px-5 file:py-2 file:bg-gray-800 file:text-gray-300 file:rounded-lg file:backdrop-blur-lg file:mr-3"
              />
            </div>

            <div>
              <label
                htmlFor="teamCount"
                className="block text-lg font-medium text-gray-300"
              >
                Number of Teams
              </label>
              <p className="text-xs text-gray-400 mb-3">15 members per team</p>
              <div className="relative w-32">
                <select
                  id="teamCount"
                  onChange={(e) => setTeamCount(parseInt(e.target.value))}
                  className="text-sm appearance-none w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-700 focus:ring-1 focus:ring-gray-500 focus:outline-none shadow-lg backdrop-blur-lg hover:text-gray-200"
                >
                  {teamOptions.map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Team" : "Teams"}
                    </option>
                  ))}
                  <option>More than 10 teams is crazy work 😭🙏</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ArrowDown className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="active:border-indigo-600 text-white relative inline-flex items-center bg-indigo-600 font-semibold rounded-md border-indigo-800 px-4 py-2 border-b-4 cursor-pointer">
              <input
                type="submit"
                value="Create Assignments"
                disabled={!jsonFile}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <CornerDownLeft className="w-4 h-4 ml-2" />
            </div>
          </form>
        </div>

        {showSpreadsheet && (
          <div className="max-w-6xl mx-auto rounded-2xl p-8 space-y-8 border border-gray-700">
            <SpreadsheetView assignments={optimalAssignments} events={events} />
          </div>
        )}
      </main>
    </div>
  );
}
