import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orders) => {
    const { data } = await axios.post("api/orders/createorder", orders);
    return data;
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (order) => {
    const { data } = await axios.post("api/orders/deleteorder", order);
    return data;
  }
);

export const findAllOrders = createAsyncThunk("orders/allorders", async () => {
  const { data } = await axios.get("api/orders/allorders");
  return data;
});

export const completeOrder = createAsyncThunk(
  "orders/completeOrder",
  async (order) => {
    const { data } = await axios.post("api/orders/completeorder", order);
    return data;
  }
);

export const orderSlice = createSlice({
  name: "orders",
  initialState: {
    allOrders: [],
    orderItems: [],
    createdOrder: {},
    completedOrder: {},
    deletedOrder: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createdOrder = action.payload.order;
        state.allOrders.push(action.payload.order);
      })
      .addCase(findAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload.order;
        state.orderItems = action.payload.orderItems;
      })
      .addCase(completeOrder.fulfilled, (state, action) => {
        let completedOrder = action.payload.order;
        state.completedOrder = completedOrder;
        state.allOrders = action.payload.allOrders;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.allOrders = action.payload.order;
        state.orderItems = action.payload.orderItems;
        state.deletedOrder = action.payload.order;
      });
  },
});

export const selectAllOrders = (state) => state.orders.allOrders;
export const selectOrderItems = (state) => state.orders.orderItems;
export const selectCreatedOrder = (state) => state.orders.createdOrder;
export default orderSlice.reducer;
