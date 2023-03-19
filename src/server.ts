// src/server.ts
import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import dotenv from 'dotenv';

// Laden Sie die Umgebungsvariablen aus der .env-Datei
dotenv.config();

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
}

const dataFile = "./data.json";

const loadData = (): { projects: Project[]; employees: Employee[]; timeEntries: TimeEntry[] } => {
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

const saveData = (data: { projects: Project[]; employees: Employee[]; timeEntries: TimeEntry[] }): void => {
  const dataJson = JSON.stringify(data);
  fs.writeFileSync(dataFile, dataJson);
};

app.post("/projects", (req: Request, res: Response) => {
  const { name, client } = req.body;
  const newProject: Project = { id: uuidv4(), name, client };
  const data = loadData();
  data.projects = [newProject];
  saveData(data);
  res.status(201).json(newProject);
});

app.post("/employees", (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;
  const newEmployee: Employee = { id: uuidv4(), firstName, lastName, email };
  const data = loadData();
  data.employees.push(newEmployee);
  saveData(data);
  res.status(201).json(newEmployee);
});

app.post("/timeEntries", (req: Request, res: Response) => {
  const { employeeId, projectId, task, minutes } = req.body;
  const newTimeEntry: TimeEntry = {
    id: uuidv4(),
    employeeId,
    projectId,
    task,
    minutes,
  };
  const data = loadData();
  data.timeEntries.push(newTimeEntry);
  saveData(data);
  res.status(201).json(newTimeEntry);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port 3000`);
});
