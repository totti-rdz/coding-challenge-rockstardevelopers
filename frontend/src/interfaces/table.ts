export interface Project {
  id: string;
  name: string;
  client: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  projectId: string;
  task: string;
  minutes: number;
  date: string;
}

export interface Data {
  employees: Employee[];
  projects: Project[];
  timeEntries: TimeEntry[];
}
