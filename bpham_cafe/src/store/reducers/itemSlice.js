import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const findAllItems = createAsyncThunk("menu/findAllItems", async () => {
  const { data } = await axios.get("api/menu/getitems");
  return data;
});

export const findItemById = createAsyncThunk(
  "menu/findItemById",
  async (id) => {
    const { data } = await axios.get(`api/menu/getbyid/${id}`);
    return data;
  }
);

export const createMenuItem = createAsyncThunk(
  "menu/createMenuItem",
  async (item) => {
    const { data } = await axios.post("api/menu/createitem", item);
    return data;
  }
);

export const deleteMenuItem = createAsyncThunk(
  "menu/deleteMenuItem",
  async (item) => {
    const { data } = await axios.post("api/menu/deleteitem", item);
    return data;
  }
);

export const itemSlice = createSlice({
  name: "items",
  initialState: {
    allItems: [],
    menuItemsById: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.menuItemsById.push(action.payload.items);
        state.menuItemsById = state.menuItemsById.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      })
      .addCase(findItemById.fulfilled, (state, action) => {
        state.menuItemsById = action.payload.items;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        let deletedItem = action.payload.item;
        state.menuItemsById = state.menuItemsById.filter(
          (item) => item.id !== deletedItem.id
        );
      });
  },
});

export const selectAllMenuItems = (state) => state.items.allItems;
export const selectMenuItemsById = (state) => state.items.menuItemsById;
export default itemSlice.reducer;
