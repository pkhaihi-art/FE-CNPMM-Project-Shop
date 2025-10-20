import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    fetchAllUsers,
    fetchUserById,
    updateUserByAdmin,
    deleteUserByAdmin,
} from "./AdminUserApi";

const initialState = {
    users: [],
    selectedUser: null,
    status: "idle",
    error: null,
};

export const fetchAllUsersAsync = createAsyncThunk("admin/fetchAllUsers", async () => {
    return await fetchAllUsers();
});

export const fetchUserByIdAsync = createAsyncThunk("admin/fetchUserById", async (id) => {
    return await fetchUserById(id);
});

export const updateUserByAdminAsync = createAsyncThunk("admin/updateUserByAdmin", async (update) => {
    return await updateUserByAdmin(update);
});

export const deleteUserByAdminAsync = createAsyncThunk("admin/deleteUserByAdmin", async (id) => {
    return await deleteUserByAdmin(id);
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
                state.users = action.payload.users;
            })
            .addCase(fetchAllUsersAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(updateUserByAdminAsync.fulfilled, (state, action) => {
                const idx = state.users.findIndex((u) => u._id === action.payload._id);
                if (idx !== -1) state.users[idx] = action.payload;
            })
            .addCase(deleteUserByAdminAsync.fulfilled, (state, action) => {
                state.users = state.users.filter((u) => u._id !== action.payload._id);
            });
    },
});

export const selectAdminUsers = (state) => state.AdminUserSlice.users;
export default adminUserSlice.reducer;
