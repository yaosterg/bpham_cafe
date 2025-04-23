import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (category) => {
    const { data } = await axios.post(
      "api/categories/createcategory",
      category
    );
    return data;
  }
);

export const categorySlice = createSlice({
  name: "categories",
  initialState: {
    allCategories: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.allCategories.push(action.payload.category);
    });
  },
});

export const selectAllCategories = (state) => state.categories.allCategories;
export default categorySlice.reducer;
