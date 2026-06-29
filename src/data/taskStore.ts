import { useSyncExternalStore } from "react";
import { tasks as seedTasks, type Task } from "./mock";

let store: Task[] = [...seedTasks];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  return store;
}

export function useTasks(): Task[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

let counter = store.length;
function nextId() {
  counter += 1;
  return { id: `t${Date.now()}-${counter}`, key: `TSK-${1000 + counter}` };
}

export function createTask(input: Omit<Task, "id" | "key" | "comments" | "attachments"> & Partial<Pick<Task, "id" | "key">>): Task {
  const ids = input.id && input.key ? { id: input.id, key: input.key } : nextId();
  const task: Task = {
    comments: 0,
    attachments: 0,
    ...input,
    ...ids,
  } as Task;
  store = [task, ...store];
  emit();
  return task;
}

export function updateTask(id: string, patch: Partial<Task>) {
  store = store.map((t) => (t.id === id ? { ...t, ...patch } : t));
  emit();
}

export function deleteTask(id: string) {
  store = store.filter((t) => t.id !== id);
  emit();
}

export function getTask(id: string) {
  return store.find((t) => t.id === id);
}