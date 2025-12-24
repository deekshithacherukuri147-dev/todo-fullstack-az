import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/client";

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

interface CategoriesState {
  items: Category[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

const initialState: CategoriesState = {
  items: [],
  status: "idle",
};

export const fetchCategories = createAsyncThunk<Category[]>(
  "categories/fetch",
  async () => {
    return await api.get("/categories");
  }
);

export const createCategory = createAsyncThunk<Category, string>(
  "categories/create",
  async (name: string) => {
    return await api.post("/categories", { name });
  }
);

export const deleteCategory = createAsyncThunk<string, string>(
  "categories/delete",
  async (id: string) => {
    await api.delete(`/categories/${id}`);
    return id;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;
