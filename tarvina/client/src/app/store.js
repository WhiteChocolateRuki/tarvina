// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import auth from "../features/authSlice";
import posts from "../features/postsSlice";

export const store = configureStore({
  reducer: { auth, posts },
});
