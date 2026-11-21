import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axiosInstance, { apiError, TOKEN_KEY } from "@/lib/axios";
import type { ApiResponse, TokenUser } from "@/types";

interface UserCredentials {
  email: string;
  password: string;
}

interface AuthState {
  user: TokenUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: AuthState = { user: null, token: null, loading: false, error: null, message: null };

// Log in: the API returns an access token; the user is read from it
export const loginUser = createAsyncThunk<ApiResponse<{ accessToken: string }>, UserCredentials, { rejectValue: string }>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", credentials);
      localStorage.setItem(TOKEN_KEY, JSON.stringify(data.data.accessToken));
      return data;
    } catch (e) {
      return rejectWithValue(apiError(e, "Login failed"));
    }
  }
);

// Forgotten password: request a code, then check it
export const requestOtp = createAsyncThunk<ApiResponse<null>, { email: string }, { rejectValue: string }>(
  "auth/forget",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/forget", payload);
      return data;
    } catch (e) {
      return rejectWithValue(apiError(e, "Request failed"));
    }
  }
);

export const validateRequestOtp = createAsyncThunk<ApiResponse<null>, { email: string; otp: string }, { rejectValue: string }>(
  "auth/validate",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/validate", payload);
      return data;
    } catch (e) {
      return rejectWithValue(apiError(e, "That code is not right"));
    }
  }
);

const decode = (token: string): TokenUser | null => {
  try {
    return jwtDecode<TokenUser>(token);
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
      state.message = null;
    },
    logout(state) {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.message = null;
      if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
    },
    // called by the axios interceptor after a silent token refresh
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.user = decode(action.payload) ?? state.user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.data.accessToken;
        state.user = decode(action.payload.data.accessToken);
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = action.payload || "Check your email and password";
      })
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Code sent";
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to request a code";
      })
      .addCase(validateRequestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateRequestOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Code accepted";
      })
      .addCase(validateRequestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "That code is not right";
      });
  },
});

export const { resetError, logout, setToken } = authSlice.actions;
export default authSlice.reducer;
