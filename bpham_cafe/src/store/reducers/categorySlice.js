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

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (category) => {
    const { data } = await axios.put(
      `api/categories/updatecategory/${category.id}`,
      category
    );
    return data;
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (category) => {
    const { data } = await axios.post(
      "api/categories/deletecategory",
      category
    );
    return data;
  }
);

export const findAllCategories = createAsyncThunk(
  "category/findAllCategories",
  async () => {
    const { data } = await axios.get("api/categories/getcategories");
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
    builder
      .addCase(createCategory.fulfilled, (state, action) => {
        state.allCategories.push(action.payload.category);
        state.allCategories = state.allCategories.sort((a, b) =>
          a.category.localeCompare(b.category)
        );
      })
      .addCase(findAllCategories.fulfilled, (state, action) => {
        state.allCategories = action.payload.categories;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        let updatedCategory = action.payload;
        state.allCategories.map((category) => {
          if (category.id === updatedCategory.id) {
            category.category = updatedCategory.category;
          }
        });
        state.allCategories = state.allCategories.sort((a, b) =>
          a.category.localeCompare(b.category)
        );
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        let deletedCategory = action.payload.category;
        state.allCategories = state.allCategories.filter(
          (category) => category.id !== deletedCategory.id
        );
      });
  },
});

export const selectAllCategories = (state) => state.categories.allCategories;
export default categorySlice.reducer;
