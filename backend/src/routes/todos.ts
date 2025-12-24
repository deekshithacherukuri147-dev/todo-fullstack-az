import { Router } from "express";
import { todos, categories, generateId } from "../store/db";

const router = Router();

const isValidDate = (value: string | Date): boolean => {
  const timestamp = new Date(value).getTime();
  return !Number.isNaN(timestamp);
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && Boolean(value.trim());

const validateTodoInput = (payload: {
  title?: unknown;
  description?: unknown;
  dueDate?: unknown;
  categoryId?: unknown;
}) => {
  if (payload.title !== undefined && !isNonEmptyString(payload.title)) {
    return "Title is required";
  }

  if (
    payload.description !== undefined &&
    typeof payload.description !== "string"
  ) {
    return "Description must be text";
  }

  if (payload.dueDate !== undefined && !isValidDate(payload.dueDate as string)) {
    return "Invalid due date";
  }

  if (payload.categoryId !== undefined && typeof payload.categoryId !== "string") {
    return "Invalid category";
  }

  return null;
};

const isPastDate = (value: string | Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = new Date(value);
  compare.setHours(0, 0, 0, 0);
  return compare.getTime() < today.getTime();
};

router.get("/", (req, res) => {
  const status = req.query.status as "active" | "completed" | undefined;
  const sort = (req.query.sort as "dueDate" | "createdAt" | undefined) ?? "createdAt";
  const order = (req.query.order as "asc" | "desc" | undefined) ?? "asc";
  const page = Math.max(1, Number.parseInt((req.query.page as string) || "1", 10));
  const pageSize = Math.max(1, Math.min(50, Number.parseInt((req.query.pageSize as string) || "10", 10)));

  let result = todos.slice();

  if (status === "active") {
    result = result.filter(t => !t.completed);
  }
  if (status === "completed") {
    result = result.filter(t => t.completed);
  }

  const direction = order === "desc" ? -1 : 1;
  result.sort((a, b) => {
    const aVal =
      sort === "dueDate"
        ? new Date(a.dueDate).getTime()
        : new Date(a.createdAt).getTime();
    const bVal =
      sort === "dueDate"
        ? new Date(b.dueDate).getTime()
        : new Date(b.createdAt).getTime();
    return (aVal - bVal) * direction;
  });

  const total = result.length;
  const start = (page - 1) * pageSize;
  const paged = result.slice(start, start + pageSize);

  res.json({
    items: paged,
    total,
    page,
    pageSize,
  });
});

router.post("/", (req, res) => {
  const { title, description, dueDate, categoryId } = req.body;

  const validationError = validateTodoInput({ title, description, dueDate, categoryId });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  if (!isNonEmptyString(title) || !isNonEmptyString(categoryId) || !dueDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!categories.some(c => c.id === categoryId)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  if (isPastDate(dueDate)) {
    return res.status(400).json({ message: "Due date cannot be in the past" });
  }

  const newTodo = {
    id: generateId(),
    title: title.trim(),
    description: description?.trim() || undefined,
    dueDate: new Date(dueDate),
    completed: false,
    categoryId,
    createdAt: new Date(),
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, categoryId, completed } = req.body;

  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  const validationError = validateTodoInput({ title, description, dueDate, categoryId });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  if (categoryId && !categories.some(c => c.id === categoryId)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  if (dueDate !== undefined && isPastDate(dueDate)) {
    return res.status(400).json({ message: "Due date cannot be in the past" });
  }

  if (title !== undefined) todo.title = title.trim();
  if (description !== undefined) todo.description = description?.trim() || undefined;
  if (dueDate !== undefined) todo.dueDate = new Date(dueDate);
  if (categoryId !== undefined) todo.categoryId = categoryId;
  if (completed !== undefined) todo.completed = Boolean(completed);

  res.json(todo);
});

router.patch("/:id/toggle", (req, res) => {
  const { id } = req.params;
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  todo.completed = !todo.completed;
  res.status(200).json(todo);
});

router.delete("/:id", (req, res) => {
  const index = todos.findIndex(t => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  todos.splice(index, 1);
  res.status(204).send();
});

export default router;
