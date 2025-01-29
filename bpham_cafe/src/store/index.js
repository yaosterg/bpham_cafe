import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import orderSlice from "./reducers/orderSlice";

export const store = configureStore({
  reducer: {
    orders: orderSlice,
  },
});

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
export default store;
