import crypto from "crypto";

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  categoryId: string;
  createdAt: Date;
}
export const categories: Category[] = [];
export const todos: Todo[] = [];
export const generateId = () => crypto.randomUUID();
