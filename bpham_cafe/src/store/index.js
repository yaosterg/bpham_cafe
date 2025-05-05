import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import orderSlice from "./reducers/orderSlice";
import categorySlice from "./reducers/categorySlice";
import ingredientSlice from "./reducers/ingredientSlice";
import itemSlice from "./reducers/itemSlice";

export const store = configureStore({
  reducer: {
    orders: orderSlice,
    categories: categorySlice,
    ingredients: ingredientSlice,
    items: itemSlice,
  },
});

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
export default store;
