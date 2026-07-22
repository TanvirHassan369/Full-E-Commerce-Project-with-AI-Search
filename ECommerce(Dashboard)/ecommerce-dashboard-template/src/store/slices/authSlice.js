import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axiosInstance";

export const loginAdmin = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", credentials);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const loadUser = createAsyncThunk("auth/loadUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/auth/me");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to load user");
  }
});

export const logoutAdmin = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/auth/logout");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

export const updateAdminProfile = createAsyncThunk("auth/updateProfile", async (profileData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.put("/auth/profile/update", profileData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Profile update failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    isAuthenticated: false,
    error: null,
    message: null,
  },
  reducers: {
    clearAuthError: (state) => { state.error = null; },
    clearAuthMessage: (state) => { state.message = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => { state.loading = true; })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(loadUser.pending, (state) => { state.loading = true; })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutAdmin.pending, (state) => { state.loading = true; })
      .addCase(logoutAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.message = action.payload?.message || "Logged out";
      })
      .addCase(logoutAdmin.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(updateAdminProfile.pending, (state) => { state.loading = true; })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthError, clearAuthMessage } = authSlice.actions;
export default authSlice.reducer;
