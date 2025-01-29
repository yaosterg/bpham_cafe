import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orders) => {
    const { data } = await axios.post("api/createorder", orders);
    return data;
  }
);

export const findAllOrders = createAsyncThunk("orders/allorders", async () => {
  const { data } = await axios.get("api/allorders");
  return data;
});

export const completeOrder = createAsyncThunk(
  "orders/completeOrder",
  async (order) => {
    const { data } = await axios.post("api/completeorder", order);
    return data;
  }
);

export const orderSlice = createSlice({
  name: "orders",
  initialState: {
    allOrders: [],
    completedOrder: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.allOrders.push(action.payload.order);
      })
      .addCase(findAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload.order;
      })
      .addCase(completeOrder.fulfilled, (state, action) => {
        let completedOrder = action.payload.order;
        state.completedOrder = completedOrder;
        const updateOrders = state.allOrders.map((order) =>
          order.id === completedOrder.id ? (order = completedOrder) : order
        );
        state.allOrders = updateOrders;
      });
  },
});

export const selectAllOrders = (state) => state.orders.allOrders;
export default orderSlice.reducer;
