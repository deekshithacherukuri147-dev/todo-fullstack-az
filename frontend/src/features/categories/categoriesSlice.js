import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/client";

const initialState = {
  items: [],
  status: "idle",
};

export const fetchCategories = createAsyncThunk("categories/fetch", async () => {
  return await api.get("/categories");
});

export const createCategory = createAsyncThunk("categories/create", async (name) => {
  return await api.post("/categories", { name });
});

export const deleteCategory = createAsyncThunk("categories/delete", async (id) => {
  await api.delete(`/categories/${id}`);
  return id;
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
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
        // FIX: Filter by _id (MongoDB) OR id (standard) to be safe
        state.items = state.items.filter((c) => (c._id || c.id) !== action.payload);
      });
  },
});

export default categoriesSlice.reducer;
