import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAuthPopup } from "./popupSlice";
import { clearCart } from "./cartSlice";
// Register
export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/register", data, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      return { otpSent: true, email: data.email };
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

// Verify OTP
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/register/verify-otp", { email, otp }, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      thunkAPI.dispatch(toggleAuthPopup());
      return res.data.user;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

// Resend OTP
export const resendOTP = createAsyncThunk(
  "auth/resendOTP",
  async (email, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/register/resend-otp", { email });
      toast.success(res.data.message);
      return res.data.message;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);


// Login
export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/login", data, {
      withCredentials: true,
    });
    toast.success(res.data.message);
    thunkAPI.dispatch(toggleAuthPopup());
    return res.data.user;
  } catch (error) {
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});


// Get User Profile
export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return res.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to fetch user profile",
      );
    }
  },
);


// Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/auth/logout");
      thunkAPI.dispatch(toggleAuthPopup());
      thunkAPI.dispatch(clearCart());
      toast.success(res.data.message || "Logged out successfully");
      return null;
    } catch (error) {
      toast.error(error.response.data.message || "Failed to logout");
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to fetch user profile",
      );
    }
  },
);


// Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        "/auth/password/forgot?frontendUrl=http://localhost:5173",
        { email },
      );
      toast.success(res.data.message);
      return res.data.message;
    } catch (error) {
      toast.error(
        error.response.data.message || "Failed to send password reset email",
      );
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to send password reset email",
      );
    }
  },
);


// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password, confirmPassword }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/auth/password/reset/${token}`, {
        password,
        confirmPassword,
      });
      toast.success(res.data.message);
      thunkAPI.dispatch(toggleAuthPopup());
      return res.data.user;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to reset password",
      );
    }
  },
);


// Update Password
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/auth/password/update`, data);
      toast.success(res.data.message);
      return null;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to update password",
      );
    }
  },
);

// Update Profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/auth/profile/update`, data);
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(
        error.response.data.message || "Failed to update profile",
      );
    }
  },
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isSigningUp = false;
        // OTP sent — don't set authUser yet
      })
      .addCase(register.rejected, (state) => {
        state.isSigningUp = false;
      });

    // Verify OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isSigningUp = false;
        state.authUser = action.payload;
      })
      .addCase(verifyOTP.rejected, (state) => {
        state.isSigningUp = false;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.authUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      });

    // Get User Profile
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.authUser = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state, action) => {
        state.authUser = null;
      })
      .addCase(logout.rejected, (state, action) => {
        // Logout failed, keep current state
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isRequestingForToken = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isRequestingForToken = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isRequestingForToken = false;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isUpdatingPassword = false;
        state.authUser = action.payload; // Set the authenticated user after successful password reset
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isUpdatingPassword = false;
      });

    // Update Password
    builder
      .addCase(updatePassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isUpdatingPassword = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isUpdatingPassword = false;
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        if (action.payload && typeof action.payload === "object" && !Array.isArray(action.payload)) {
          state.authUser = { ...state.authUser, ...action.payload };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdatingProfile = false;
      });
  },
});

export default authSlice.reducer;
