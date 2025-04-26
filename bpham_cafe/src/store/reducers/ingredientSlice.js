import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const findAllIngredients = createAsyncThunk(
  "ingredients /findAllIngredients",
  async () => {
    const { data } = await axios.get("api/ingredients/getingredients");
    return data;
  }
);

export const createIngredient = createAsyncThunk(
  "ingredient/createIngredient",
  async (ingredient) => {
    const { data } = await axios.post(
      "api/ingredients/createingredient",
      ingredient
    );
    return data;
  }
);

export const ingredientSlice = createSlice({
  name: "ingredients",
  initialState: {
    allIngredients: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(findAllIngredients.fulfilled, (state, action) => {
        state.allIngredients = action.payload.ingredients;
      })
      .addCase(createIngredient.fulfilled, (state, action) => {
        state.allIngredients.push(action.payload.ingredient);
        state.allIngredients = state.allIngredients.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      });
  },
});

export const selectAllIngredients = (state) => state.ingredients.allIngredients;
export default ingredientSlice.reducer;
