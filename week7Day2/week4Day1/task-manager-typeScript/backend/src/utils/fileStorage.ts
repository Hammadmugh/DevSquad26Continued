// In-memory storage
let tasksStore: any[] = [];

// Generate simple unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Initialize storage (no-op for in-memory)
export const initializeStorage = (): void => {
  console.log("In-memory storage initialized");
};

// Task operations
export const readTasks = (): any[] => {
  return tasksStore;
};

export const writeTasks = (tasks: any[]): void => {
  tasksStore = tasks;
};

export const findTaskById = (id: string): any | null => {
  const tasks = readTasks();
  return tasks.find((task) => task._id === id) || null;
};

export const getAllTasks = (): any[] => {
  return readTasks();
};

export const findTasksByTitle = (title: string): any[] => {
  const tasks = readTasks();
  const regex = new RegExp(title, "i");
  return tasks.filter((task) => regex.test(task.title));
};

export const createTask = (title: string, completed: boolean): any => {
  const tasks = readTasks();
  const newTask = {
    _id: generateId(),
    title,
    completed,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  tasks.push(newTask);
  writeTasks(tasks);
  return newTask;
};

export const updateTaskById = (id: string, updateData: any): any | null => {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex((task) => task._id === id);

  if (taskIndex === -1) return null;

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updateData,
    updatedAt: new Date(),
  };
  writeTasks(tasks);
  return tasks[taskIndex];
};

export const deleteTaskById = (id: string): any | null => {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex((task) => task._id === id);

  if (taskIndex === -1) return null;

  const deletedTask = tasks.splice(taskIndex, 1);
  writeTasks(tasks);
  return deletedTask[0];
};

export const getTaskStats = (): any => {
  const tasks = readTasks();
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
  };
};
