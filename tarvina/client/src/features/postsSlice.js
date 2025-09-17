import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// GET posts
export const fetchPosts = createAsyncThunk(
  "posts/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/posts");
      return data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Post fetch failed" });
    }
  }
);

// Create post
export const createPost = createAsyncThunk(
  "posts/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/posts", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Create failed" });
    }
  }
);

// Update post
export const updatePost = createAsyncThunk(
  "posts/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/posts/${id}`, updates);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Update failed" });
    }
  }
);

// Delete post
export const deletePost = createAsyncThunk(
  "posts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/posts/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Delete failed" });
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPosts.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchPosts.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload || [];
      })
      .addCase(fetchPosts.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || "Bir hata oluştu";
      })

      // Create
      .addCase(createPost.fulfilled, (s, a) => {
        s.items.unshift(a.payload); // yeni yazı başa eklenir
      })

      // Update
      .addCase(updatePost.fulfilled, (s, a) => {
        const i = s.items.findIndex((p) => p._id === a.payload._id);
        if (i !== -1) s.items[i] = a.payload;
      })

      // Delete
      .addCase(deletePost.fulfilled, (s, a) => {
        s.items = s.items.filter((p) => p._id !== a.payload);
      });
  },
});

export default postsSlice.reducer;
