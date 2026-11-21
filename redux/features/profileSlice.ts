import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";
import type { User } from "@/types";

type Profile = Omit<User, "password">;

export const fetchUserProfile = createAsyncThunk<Profile, string>("profile/fetchUserProfile", async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data.data;
});

export const updateUserProfile = createAsyncThunk<Profile, { userId: string; profileData: Partial<User> }>(
  "profile/updateUserProfile",
  async ({ userId, profileData }) => {
    const response = await axiosInstance.patch(`/users/${userId}`, profileData);
    return response.data.data;
  }
);

interface ProfileState {
  profileData: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = { profileData: null, loading: false, error: null };

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = { ...state.profileData, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default profileSlice.reducer;
