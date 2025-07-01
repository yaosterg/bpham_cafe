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

export const batchCreateIngredients = createAsyncThunk(
  "ingredient/batchCreateIngredients",
  async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await axios.post(
      "api/ingredients/createingredient/batchcreate",
      formData
    );
    return data;
  }
);

export const updateIngredient = createAsyncThunk(
  "ingredient/updateIngredient",
  async (ingredient) => {
    const { data } = await axios.put(
      `api/ingredients/updateingredients/${ingredient.id}`,
      ingredient
    );
    return data;
  }
);

export const deleteIngredient = createAsyncThunk(
  "ingredient/deleteIngredient",
  async (ingredient) => {
    const { data } = await axios.post(
      "api/ingredients/deleteingredient",
      ingredient
    );
    return data;
  }
);

export const ingredientSlice = createSlice({
  name: "ingredients",
  initialState: {
    allIngredients: [],
    editedIngredient: {},
  },
  reducers: {
    setEditedIngredient: (state, action) => {
      state.editedIngredient = action.payload;
    },
  },
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
      })
      .addCase(batchCreateIngredients.fulfilled, (state, action) => {
        state.allIngredients = action.payload.ingredients;
      })
      .addCase(deleteIngredient.fulfilled, (state, action) => {
        let deletedIngredient = action.payload.ingredient;
        state.allIngredients = state.allIngredients.filter(
          (ingredient) => ingredient.id !== deletedIngredient.id
        );
      })
      .addCase(updateIngredient.fulfilled, (state, action) => {
        const updatedIngredient = action.payload.updatedIngredient;

        // Properly replace in array
        state.allIngredients = state.allIngredients.map((ingredient) =>
          ingredient.id === updatedIngredient.id
            ? updatedIngredient
            : ingredient
        );
        state.editedIngredient = updatedIngredient;
        state.allIngredients = state.allIngredients.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      });
  },
});

export const selectAllIngredients = (state) => state.ingredients.allIngredients;
export const selectEditedIngredient = (state) =>
  state.ingredients.editedIngredient;
export default ingredientSlice.reducer;
export const { setEditedIngredient } = ingredientSlice.actions;
