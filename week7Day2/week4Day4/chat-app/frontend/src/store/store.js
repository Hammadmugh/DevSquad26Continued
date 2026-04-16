import { configureStore } from "@reduxjs/toolkit";
import { chatApi } from "./chatApi";
import chatReducer from "./chatSlice";

export const store = configureStore({
  reducer: {
    [chatApi.reducerPath]: chatApi.reducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware),
});
