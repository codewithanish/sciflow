import { NextRequest, NextResponse } from "next/server";
import MinHeap from "heap-js";

interface TournamentEventData {
  [event: string]: {
    partners: string[];
    "event-placement": number;
    "event-total-competing-teams": number;
  };
}

interface Tournaments {
  [tournamentName: string]: {
    date: string;
    weight: number;
    teams: {
      [teamName: string]: TournamentEventData;
    };
  };
}

interface TestOffEvent {
  "event-name": string;
  participants: {
    "student-name": string;
    placement: number;
  }[];
}

interface TestOffs {
  [testOffName: string]: {
    weight: number;
    events: TestOffEvent[];
  };
}

interface TeamData {
  events: string[];
  students: string[];
  tournaments: Tournaments;
  "test-offs": TestOffs;
}

type Agent = {
  student: string;
  weights: number[];
};

type Assignment = {
  task: string;
  agents: string[];
  cost: number;
  team: string;
};

const weightEvents = (data: TeamData) => {
  const { events, students, tournaments, "test-offs": testOffs } = data;

  // **1. Preprocess test-off data for O(1) lookup**
  const testOffMap = new Map<
    string,
    Map<string, { placement: number; weight: number }>
  >();

  for (const testOff of Object.values(testOffs)) {
    for (const event of testOff.events) {
      for (const participant of event.participants) {
        if (!testOffMap.has(participant["student-name"])) {
          testOffMap.set(participant["student-name"], new Map());
        }
        testOffMap.get(participant["student-name"])!.set(event["event-name"], {
          placement: participant.placement,
          weight: testOff.weight,
        });
      }
    }
  }

  // **2. Preprocess tournament data for O(1) lookup**
  const tournamentMap = new Map<
    string,
    Map<string, { placement: number; totalTeams: number; weight: number }>
  >();

  for (const tournament of Object.values(tournaments)) {
    for (const team of Object.values(tournament.teams)) {
      for (const event in team) {
        const eventData = team[event];

        if (!eventData || !Array.isArray(eventData.partners)) {
          console.warn(
            `Skipping event ${event} due to missing or invalid partners field`
          );
          continue;
        }
        for (const studentName of eventData.partners) {
          if (!tournamentMap.has(studentName)) {
            tournamentMap.set(studentName, new Map());
          }
          tournamentMap.get(studentName)!.set(event, {
            placement: eventData["event-placement"],
            totalTeams: eventData["event-total-competing-teams"],
            weight: tournament.weight,
          });
        }
      }
    }
  }

  // **3. Compute student weights using the precomputed maps**
  const studentWeights = students.map((student) => {
    const studentName = student;
    const weights = events.map((event) => {
      let totalTestScore = 0,
        totalTestWeight = 0;
      let totalTournamentScore = 0,
        totalTournamentWeight = 0;

      // **O(1) lookup for test-off scores**
      if (
        testOffMap.has(studentName) &&
        testOffMap.get(studentName)!.has(event)
      ) {
        const { placement, weight } = testOffMap.get(studentName)!.get(event)!;
        // Find the test off event that matches the current event name
        const testOffEvent = Object.values(testOffs)
          .flatMap((t) => t.events)
          .find((e) => e["event-name"] === event);
        const participantsLength = testOffEvent?.participants?.length || 1;
        const normalizedPlacement = 1 - placement / participantsLength;
        totalTestScore += normalizedPlacement * weight;
        totalTestWeight += weight;
      }

      // **O(1) lookup for tournament scores**
      if (
        tournamentMap.has(studentName) &&
        tournamentMap.get(studentName)!.has(event)
      ) {
        const { placement, totalTeams, weight } = tournamentMap
          .get(studentName)!
          .get(event)!;
        const normalizedPlacement = 1 - placement / totalTeams;
        totalTournamentScore += normalizedPlacement * weight;
        totalTournamentWeight += weight;
      }

      const finalTestScore =
        totalTestWeight > 0 ? totalTestScore / totalTestWeight : 0;
      const finalTournamentScore =
        totalTournamentWeight > 0
          ? totalTournamentScore / totalTournamentWeight
          : 0;

      return -(finalTournamentScore + finalTestScore - 2);
    });

    return { student, weights };
  });

  return studentWeights;
};

const threePersonTasks = new Set(["Codebusters", "Experimental Design"]);

// Divide agents into teams based on performance
function divideTeams(
  agents: Agent[],
  teamCount: number,
  teamSize: number = 15
): Agent[][] {
  const sortedAgents = agents
    .map((agent) => ({
      ...agent,
      avgWeight:
        agent.weights.reduce((sum, w) => sum + w, 0) / agent.weights.length,
    }))
    .sort((a, b) => a.avgWeight - b.avgWeight); // Best agents first

  const teams: Agent[][] = [];
  for (let i = 0; i < teamCount; i++) {
    const startIdx = i * teamSize;
    const endIdx = Math.min(startIdx + teamSize, sortedAgents.length);
    if (startIdx < sortedAgents.length) {
      teams.push(sortedAgents.slice(startIdx, endIdx));
    }
  }
  return teams;
}

// Assign tasks optimally for a given team
function assignTasks(
  agents: Agent[],
  tasks: string[],
  teamName: string
): Assignment[] {
  const taskAssignments: Assignment[] = [];
  const taskCount = tasks.length;

  // Min-heap for each task to track best agents
  const taskMinHeaps: Map<
    number,
    MinHeap<{ student: string; weight: number }>
  > = new Map();

  for (let i = 0; i < taskCount; i++) {
    const minHeap = new MinHeap<{ student: string; weight: number }>(
      (a, b) => a.weight - b.weight
    );
    agents.forEach((agent) => {
      minHeap.push({ student: agent.student, weight: agent.weights[i] });
    });
    taskMinHeaps.set(i, minHeap);
  }

  // Track how many tasks each agent is assigned
  const agentAssignments: Map<string, number> = new Map();

  for (let i = 0; i < taskCount; i++) {
    const taskName = tasks[i];
    const minHeap = taskMinHeaps.get(i)!;
    const requiredAgents = threePersonTasks.has(taskName) ? 3 : 2;
    const bestAgents: { student: string; weight: number }[] = [];

    while (bestAgents.length < requiredAgents && !minHeap.isEmpty()) {
      const candidate = minHeap.pop();
      if (!candidate) break;

      bestAgents.push(candidate);
      agentAssignments.set(
        candidate.student,
        (agentAssignments.get(candidate.student) || 0) + 1
      );
    }

    // Ensure we always assign the required number of agents
    while (bestAgents.length < requiredAgents) {
      const fallback = agents.reduce((best, agent) => {
        if (!best || agent.weights[i] < best.weights[i]) {
          return agent;
        }
        return best;
      }, agents[0]);

      bestAgents.push({
        student: fallback.student,
        weight: fallback.weights[i],
      });
      agentAssignments.set(
        fallback.student,
        (agentAssignments.get(fallback.student) || 0) + 1
      );
    }

    taskAssignments.push({
      task: taskName,
      agents: bestAgents.map((a) => a.student),
      cost: bestAgents.reduce((sum, agent) => sum + agent.weight, 0),
      team: teamName,
    });
  }

  return taskAssignments;
}

// Scale up to multiple teams dynamically
function assignTasksToMultipleTeams(
  agents: Agent[],
  tasks: string[],
  teamCount: number
): Assignment[] {
  const teams = divideTeams(agents, teamCount);
  let allAssignments: Assignment[] = [];

  teams.forEach((teamAgents, index) => {
    const teamName = `Team ${index + 1}`;
    const assignments = assignTasks(teamAgents, tasks, teamName);
    allAssignments = allAssignments.concat(assignments);
  });

  return allAssignments;
}

export async function POST(req: NextRequest) {
  try {
    console.log("Received API request:", req.method, req.headers);

    const body = await req.json();
    console.log("API received request body:", body);

    const { data, teamCount } = body;
    if (!data || !teamCount) {
      console.log("Missing required data:", { data, teamCount });
      return NextResponse.json(
        { error: "Missing data or teamCount" },
        { status: 400 }
      );
    }

    if (!Array.isArray(data.events)) {
      console.log("Invalid data format:", data);
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    const weightedEvents = weightEvents(data);
    const assignments = assignTasksToMultipleTeams(
      weightedEvents,
      data.events,
      teamCount
    );

    console.log("API returning assignments:", assignments);
    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
