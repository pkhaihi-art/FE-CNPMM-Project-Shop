import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    fetchAllUsers,
    blockUser,
    unblockUser,
} from "./AdminUserApi";

const initialState = {
    users: [],
    status: "idle",
    error: null,
};

export const fetchAllUsersAsync = createAsyncThunk("admin/fetchAllUsers", async () => {
    return await fetchAllUsers();
});

export const blockUserAsync = createAsyncThunk("admin/blockUser", async (userId) => {
    await blockUser(userId);
    return userId; // Trả về userId để update state
});

export const unblockUserAsync = createAsyncThunk("admin/unblockUser", async (userId) => {
    await unblockUser(userId);
    return userId; // Trả về userId để update state
});

const adminUserSlice = createSlice({
    name: "AdminUserSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsersAsync.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllUsersAsync.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Backend trả về { message, users, total }
                state.users = action.payload.users || [];
            })
            .addCase(fetchAllUsersAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(blockUserAsync.fulfilled, (state, action) => {
                // Update isVerified thành false cho user bị khóa
                const idx = state.users.findIndex((u) => u._id === action.payload);
                if (idx !== -1) {
                    state.users[idx].isVerified = false;
                }
            })
            .addCase(unblockUserAsync.fulfilled, (state, action) => {
                // Update isVerified thành true cho user được mở khóa
                const idx = state.users.findIndex((u) => u._id === action.payload);
                if (idx !== -1) {
                    state.users[idx].isVerified = true;
                }
            });
    },
});

export const selectAdminUsers = (state) => state.AdminUserSlice.users;
export default adminUserSlice.reducer;