import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/client";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

interface TodosState {
  items: Todo[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  total: number;
  page: number;
  pageSize: number;
}

type FetchFilters = {
  status?: "all" | "active" | "completed";
  sort?: "createdAt" | "dueDate";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

const initialState: TodosState = {
  items: [],
  status: "idle",
  total: 0,
  page: 1,
  pageSize: 10,
};

type TodosResponse = {
  items: Todo[];
  total: number;
  page: number;
  pageSize: number;
};

export const fetchTodos = createAsyncThunk<TodosResponse, FetchFilters | undefined>(
  "todos/fetch",
  async (filters?: FetchFilters) => {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== "all") params.append("status", filters.status);
    if (filters?.sort) params.append("sort", filters.sort);
    if (filters?.order) params.append("order", filters.order);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.pageSize) params.append("pageSize", filters.pageSize.toString());
    const query = params.toString();
    const path = query ? `/todos?${query}` : "/todos";
    return await api.get(path);
  }
);

export const createTodo = createAsyncThunk<
  Todo,
  { title: string; description?: string; categoryId: string; dueDate: string }
>("todos/create", async payload => {
  return await api.post("/todos", payload);
});

export const updateTodo = createAsyncThunk<
  Todo,
  {
    id: string;
    title?: string;
    description?: string;
    dueDate?: string;
    categoryId?: string;
    completed?: boolean;
  }
>("todos/update", async ({ id, ...data }) => {
  return await api.put(`/todos/${id}`, data);
});

export const toggleTodo = createAsyncThunk<Todo, string>(
  "todos/toggle",
  async (id: string) => {
    return await api.patch(`/todos/${id}/toggle`);
  }
);

export const deleteTodo = createAsyncThunk<string, string>(
  "todos/delete",
  async (id: string) => {
    await api.delete(`/todos/${id}`);
    return id;
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, state => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.total += 1;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export default todosSlice.reducer;
