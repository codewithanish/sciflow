import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

type Assignment = {
  task: string;
  agents: string[];
  cost: number;
  team: string;
};

interface SpreadsheetViewProps {
  assignments: Assignment[];
  events: string[];
}

export default function SpreadsheetView({
  assignments,
}: SpreadsheetViewProps) {
  // Group assignments by team
  const teamAssignments = assignments.reduce((acc, assignment) => {
    if (!acc[assignment.team]) {
      acc[assignment.team] = [];
    }
    acc[assignment.team].push(assignment);
    return acc;
  }, {} as Record<string, Assignment[]>);

  return (
    <TabGroup>
      <TabList className="flex space-x-2 border-b border-gray-500 mb-3">
        {Object.keys(teamAssignments).map((teamName) => (
          <Tab
            key={teamName}
            className="rounded-t-md py-2 px-5 text-sm/6 font-semibold text-gray-300 focus:outline-none data-[selected]:bg-white/15 data-[hover]:bg-white/10 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
          >
            {teamName}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {Object.entries(teamAssignments).map(([teamName, teamAssignments]) => (
          <TabPanel key={teamName}>
            <div className="rounded-md shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white/5 backdrop-blur-lg">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-1/4">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-1/2">
                        Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-1/4">
                        Total Weight
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/15 backdrop-blur-lg">
                    {teamAssignments.map((assignment, index) => (
                      <tr
                        key={index}
                        className="hover:bg-white/10 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-pink-400">
                          {assignments[index].task}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <div className="flex space-x-2">
                            {assignment.agents.map((agent, index) => (
                              <div
                                key={agent}
                                className="relative group cursor-help"
                              >
                                <span>{agent}</span>
                                {index < assignment.agents.length - 1 && ", "}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                  Weight: {(assignment.cost / 2).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                          {assignment.cost.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
