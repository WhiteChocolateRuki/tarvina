import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Login
export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", payload);
     
      if (data.token) localStorage.setItem("token", data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

// Register
export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", payload);
      if (data.token) localStorage.setItem("token", data.token);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Register failed" });
    }
  }
);

const initialToken = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: initialToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    setCredentials(state, action) {
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
      if (state.token) localStorage.setItem("token", state.token);
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Bir hata oluştu";
    };

    builder
      .addCase(login.pending, pending)
      .addCase(register.pending, pending)
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
      })
      .addCase(login.rejected, rejected)
      .addCase(register.rejected, rejected);
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
