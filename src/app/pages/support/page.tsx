"use client";

import { useState } from "react";
import { ArrowUpToLine, ArrowDownToLine } from "lucide-react";

export default function Support() {
  const [showCode, setShowCode] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(5,5,32,255))]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl font-medium text-stone-100 tracking-tight">
            Support & Documentation
          </h1>
          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-3xl font-medium text-gray-200">
                Creating JSON Data
              </h2>
              <p className="text-gray-300 leading-relaxed">
                To use the Event Assigner, you&apos;ll need to prepare your data in JSON format. Here&apos;s how to structure your JSON file:
              </p>
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                <p
                  className="text-white text-sm mb-4 cursor-pointer"
                  onClick={() => setShowCode(!showCode)}
                >
                  {showCode ? (
                    <span className="inline">
                      <ArrowUpToLine className="inline h-3 mb-1" />
                      Collapse
                    </span>
                  ) : (
                    <span className="inline">
                      <ArrowDownToLine className="inline h-3 mb-1" />
                      Expand
                    </span>
                  )}
                </p>
                <pre
                  className={`text-gray-300 overflow-x-auto ${
                    showCode ? "visible" : "hidden"
                  }`}
                >
                  {`{
    "events": [
        "Air Trajectory",
        "Anatomy and Physiology",
        ...
    ],
    "students": [
        "Jane Doe",
        "Bob Doe",
        ...
    ],
    "tournaments": [
        "regionals": {
        "tournament-date": "202x-xx-xx",
        "weight": 0.xx,
        "teams": {
            "a-team": {
                "Air Trajectory": {
                "partners": ["Jane Doe", "Bob Doe"],
                "event-placement": x,
                "event-total-competing-teams": xx
                },
                ...
            },
            ...
        },
        ...
    ],
    "test-offs": {
        "fall-test-offs" {
            "weight": 0.xx,
            "events": [
                {
                    "event-name": "Air Trajectory",
                    "participants": [
                        {
                            "student-name": "Kelvin Quan",
                            "placement": 1
                        },
                        ...
                    ]
                }
                ...
            ]
        },
        ...
    }
}`}
                </pre>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-gray-200">
                  JSON Structure Explanation
                </h3>
                <ul className="space-y-6 text-gray-300 list-none list-inside">
                  <li>
                    <strong className="text-sm text-gray-300 overflow-x-auto font-mono bg-gray-900/50 px-2 py-1 rounded-lg border border-gray-700">
                      events
                    </strong>
                    : An array containing all 23 national event names and,
                    optionally, state-specific events (e.g., &quot;Air Trajectory&quot;,
                    &quot;Anatomy and Physiology&quot;)
                  </li>
                  <li>
                    <strong className="text-sm text-gray-300 overflow-x-auto font-mono bg-gray-900/50 px-2 py-1 rounded-lg border border-gray-700">
                      students
                    </strong>
                    : An array listing all student names in the team
                  </li>
                  <li className="space-y-2">
                    <strong className="text-sm text-gray-300 overflow-x-auto font-mono bg-gray-900/50 px-2 py-1 rounded-lg border border-gray-700">
                      tournaments
                    </strong>
                    : Contains tournament data with:
                    <ul className="space-y-3 text-gray-300 list-disc list-inside">
                      <li className="ml-6">
                        Tournament name (e.g., &quot;regionals&quot;) and date
                      </li>
                      <li className="ml-6">Tournament weight</li>
                      <li className="ml-6">
                        Teams (&quot;a-team&quot;, etc.) with event details including
                        partners, placement, and total competing teams used to
                        calculated a normalized weight
                      </li>
                    </ul>
                  </li>
                  <li className="space-y-2">
                    <strong className="text-sm text-gray-300 overflow-x-auto font-mono bg-gray-900/50 px-2 py-1 rounded-lg border border-gray-700">
                      test-offs
                    </strong>
                    : Contains practice/qualification data with:
                    <ul className="space-y-3 text-gray-300 list-disc list-inside">
                      <li className="ml-6">
                        Test-off name (e.g., &quot;fall-test-offs&quot;) with weight
                      </li>
                      <li className="ml-6">
                        Events array containing event name, participants list
                        with student names and their placements used to
                        calculate another normalized weight, which is combined
                        with the tournament weight
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-gray-200">
                  Best Practices
                </h3>
                <ol className="space-y-3 text-gray-300 list-decimal list-inside">
                  <li>Ensure there are no typos</li>
                  <li>Avoid duplicate data</li>
                  <li>Verify your JSON file and syntax is valid</li>
                </ol>
              </div>
            </section>
          </div>
          <h2 className="text-3xl font-medium text-gray-200">The Algorithm</h2>
          <div className="space-y-12">
            <section className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-200">
                General Approach
              </h3>
              <p>
                The general approach for creating this algorithm is split into 3
                steps:
              </p>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside">
                <li>Giving each student a &quot;cost&quot; for performing each event</li>
                <li>Sorting students into teams</li>
                <li>Assigning tasks to each team</li>
              </ol>
              <h3 className="text-2xl font-semibold text-gray-200">
                Weighting
              </h3>
              <p>
                The weighting algorithm plays a crucial role in optimizing task
                assignments by ensuring that tasks are assigned to the
                best-suited agents (students). It does this by leveraging task
                weights to determine agent suitability. Below is a detailed
                breakdown of the approach.
              </p>
              <p>
                Each agent (student) has a list of weights corresponding to each
                task. These weights represent how “costly” or “difficult” it is
                for the student to perform the task. Lower weights indicate
                better suitability for that task.
              </p>
              <p>For example:</p>
              <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                <p
                  className="text-white text-sm mb-4 cursor-pointer"
                  onClick={() => setShowCode(!showCode)}
                >
                  {showCode ? (
                    <span className="inline">
                      <ArrowUpToLine className="inline h-3 mb-1" />
                      Collapse
                    </span>
                  ) : (
                    <span className="inline">
                      <ArrowDownToLine className="inline h-3 mb-1" />
                      Expand
                    </span>
                  )}
                </p>
                <pre
                  className={`text-gray-300 overflow-x-auto ${
                    showCode ? "visible" : "hidden"
                  }`}
                >
                  {`{
    "student": "John Doe",
    "weights": [
        1.25, 2, 2, 2, 2, 1.85, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1.33, 2, 1.24, 2, 2
    ]
}`}
                </pre>
              </div>
              <p>Jane is best suited for the first task (1.25 weight) and task 19 (1.33 weight). She is less suited for other tasks (weights of 2, meaning higher cost). The algorithm will prioritize assigning Jane to tasks where she has the lowest weight.</p>
              <p>Before assigning tasks, the algorithm sorts agents based on their average weight across all tasks to form the best-performing teams. Sorting is done as follows:</p>
              <ol className="space-y-3 text-gray-300 list-decimal list-inside">
                  <li>Ensure there are no typos</li>
                  <li>Avoid duplicate data</li>
                </ol>
              <h3 className="text-2xl font-semibold text-gray-200">
                Dividing Teams
              </h3>
              <h3 className="text-2xl font-semibold text-gray-200">
                Assigning Events
              </h3>
              <h3 className="text-2xl font-semibold text-gray-200">
                Creating Multiple Teams
              </h3>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
