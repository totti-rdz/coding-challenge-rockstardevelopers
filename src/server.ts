// src/server.ts
import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import dotenv from "dotenv";

// Laden Sie die Umgebungsvariablen aus der .env-Datei
dotenv.config();

const maxTimeLimit = 2 * 60;

const app = express();
app.use(express.json());

interface Project {
  id: string;
  name: string;
  client: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface TimeEntry {
  id: string;
  employeeId: string;
  projectId: string;
  task: string;
  minutes: number;
  date: string;
}

const dataFile = "./data.json";

const loadData = (): {
  projects: Project[];
  employees: Employee[];
  timeEntries: TimeEntry[];
} => {
  try {
    const dataBuffer = fs.readFileSync(dataFile);
    const dataJson = dataBuffer.toString();
    return JSON.parse(dataJson);
  } catch (error) {
    return {
      projects: [],
      employees: [],
      timeEntries: [],
    };
  }
};

const saveData = (data: {
  projects: Project[];
  employees: Employee[];
  timeEntries: TimeEntry[];
}): void => {
  const dataJson = JSON.stringify(data);
  fs.writeFileSync(dataFile, dataJson);
};

const isProjectDuplicate = (newProject: Project, existingProjects: Project[]) =>
  existingProjects.some(
    (project) =>
      project.client === newProject.client && project.name === newProject.name
  );

app.get("/projects", (_, res: Response) => {
  const data = loadData();
  if (!data || !data.projects || data.projects.length === 0) {
    res.status(400).json({ error: "No projects found" });
    return;
  }
  res.status(200).json(data.projects);
});

app.post("/projects", (req: Request, res: Response) => {
  const { name, client } = req.body;
  const newProject: Project = { id: uuidv4(), name, client };
  const data = loadData();

  if (isProjectDuplicate(newProject, data.projects)) {
    res.status(400).json({ error: "Project already exists" });
    return;
  }

  data.projects.push(newProject);
  saveData(data);
  res.status(201).json(newProject);
});

app.get("/employees", (_, res: Response) => {
  const data = loadData();
  if (!data || !data.employees || data.employees.length === 0) {
    res.status(400).json({ error: "No employees found" });
    return;
  }
  res.status(200).json(data.employees);
});

app.post("/employees", (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;
  const newEmployee: Employee = { id: uuidv4(), firstName, lastName, email };
  const data = loadData();
  data.employees.push(newEmployee);
  saveData(data);
  res.status(201).json(newEmployee);
});

const isTimeLimitExceeded = (
  newTimeEntry: TimeEntry,
  existingTimeEntries: TimeEntry[]
) =>
  newTimeEntry.minutes +
    existingTimeEntries
      .filter((entry) => entry.date === newTimeEntry.date)
      .reduce((totalTime, entry) => totalTime + entry.minutes, 0) >
  maxTimeLimit;

app.post("/timeEntries", (req: Request, res: Response) => {
  const { date, employeeId, minutes, projectId, task } = req.body;
  const newTimeEntry: TimeEntry = {
    id: uuidv4(),
    employeeId,
    projectId,
    task,
    minutes,
    date,
  };
  const data = loadData();

  if (isTimeLimitExceeded(newTimeEntry, data.timeEntries)) {
    res.status(400).json({ error: "Time limit for this day exceeded" });
    return;
  }
  data.timeEntries.push(newTimeEntry);
  saveData(data);
  res.status(201).json(newTimeEntry);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});
