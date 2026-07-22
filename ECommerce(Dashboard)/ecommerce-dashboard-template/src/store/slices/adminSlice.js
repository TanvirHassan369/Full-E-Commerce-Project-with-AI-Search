import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axiosInstance";

export const fetchDashboardStats = createAsyncThunk("admin/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/admin/fetch/dashboard-stats");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
  }
});

export const fetchAllUsers = createAsyncThunk("admin/fetchAllUsers", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/admin/getallusers");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
  }
});

export const deleteUser = createAsyncThunk("admin/deleteUser", async (id, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.delete(`/admin/deleteuser/${id}`);
    return { id, message: data.message };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete user");
  }
});

export const fetchAllSubscribers = createAsyncThunk("admin/fetchAllSubscribers", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/newsletter/subscribers");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch subscribers");
  }
});

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    stats: null,
    users: [],
    subscribers: [],
    error: null,
    message: null,
  },
  reducers: {
    clearAdminError: (state) => { state.error = null; },
    clearAdminMessage: (state) => { state.message = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users || [];
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => { state.loading = true; })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(u => u.id !== action.payload.id);
        state.message = action.payload.message;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllSubscribers.pending, (state) => { state.loading = true; })
      .addCase(fetchAllSubscribers.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribers = action.payload.subscribers || [];
      })
      .addCase(fetchAllSubscribers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError, clearAdminMessage } = adminSlice.actions;
export default adminSlice.reducer;
