import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import orderSlice from "./reducers/orderSlice";
import categorySlice from "./reducers/categorySlice";

export const store = configureStore({
  reducer: {
    orders: orderSlice,
    categories: categorySlice,
  },
});

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
export default store;
