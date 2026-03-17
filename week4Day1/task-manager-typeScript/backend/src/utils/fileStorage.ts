import fs from "fs";
import path from "path";

// Use /tmp for Vercel, data/ for local
const DATA_DIR = process.env.VERCEL ? "/tmp/data" : path.join(__dirname, "../../data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const TASKS_FILE = path.join(DATA_DIR, "tasks.json");

// Generate simple unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Initialize data directory and files
export const initializeStorage = (): void => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }

  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2));
  }
};

// User operations
export const readUsers = (): any[] => {
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data);
};

export const writeUsers = (users: any[]): void => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

export const findUserByEmail = (email: string): any | null => {
  const users = readUsers();
  return users.find((user) => user.email === email) || null;
};

export const findUserById = (id: string): any | null => {
  const users = readUsers();
  return users.find((user) => user.id === id) || null;
};

export const createUser = (email: string, password: string): any => {
  const users = readUsers();
  const newUser = {
    id: generateId(),
    email,
    password,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  users.push(newUser);
  writeUsers(users);
  return newUser;
};

// Task operations
export const readTasks = (): any[] => {
  const data = fs.readFileSync(TASKS_FILE, "utf-8");
  return JSON.parse(data);
};

export const writeTasks = (tasks: any[]): void => {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

export const findTaskById = (id: string, userId: string): any | null => {
  const tasks = readTasks();
  return tasks.find((task) => task.id === id && task.user === userId) || null;
};

export const findTasksByUser = (userId: string): any[] => {
  const tasks = readTasks();
  return tasks.filter((task) => task.user === userId);
};

export const findTasksByUserAndTitle = (userId: string, title: string): any[] => {
  const tasks = readTasks();
  const regex = new RegExp(title, "i");
  return tasks.filter((task) => task.user === userId && regex.test(task.title));
};

export const createTask = (title: string, completed: boolean, userId: string): any => {
  const tasks = readTasks();
  const newTask = {
    id: generateId(),
    title,
    completed,
    user: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  tasks.push(newTask);
  writeTasks(tasks);
  return newTask;
};

export const updateTaskById = (id: string, userId: string, updateData: any): any | null => {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === id && task.user === userId);

  if (taskIndex === -1) return null;

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updateData,
    updatedAt: new Date(),
  };
  writeTasks(tasks);
  return tasks[taskIndex];
};

export const deleteTaskById = (id: string, userId: string): any | null => {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === id && task.user === userId);

  if (taskIndex === -1) return null;

  const deletedTask = tasks.splice(taskIndex, 1);
  writeTasks(tasks);
  return deletedTask[0];
};

export const getTaskStats = (userId: string): any => {
  const tasks = readTasks();
  const userTasks = tasks.filter((task) => task.user === userId);
  const completedTasks = userTasks.filter((task) => task.completed).length;
  const totalTasks = userTasks.length;
  const pendingTasks = totalTasks - completedTasks;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
  };
};
