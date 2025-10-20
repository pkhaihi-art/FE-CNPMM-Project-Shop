import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllUsersAsync,
    updateUserByAdminAsync,
    deleteUserByAdminAsync,
    selectAdminUsers,
} from "../AdminUserSlice";
import {
    Stack,
    Typography,
    Grid,
    Button,
    IconButton,
    TextField,
    Select,
    MenuItem,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

export const AdminUser = () => {
    const dispatch = useDispatch();
    const users = useSelector(selectAdminUsers);
    const theme = useTheme();
    const is480 = useMediaQuery(theme.breakpoints.down(480));
    const [editingId, setEditingId] = useState(null);
    const [role, setRole] = useState("");

    useEffect(() => {
        dispatch(fetchAllUsersAsync());
    }, [dispatch]);

    const handleUpdateRole = (id) => {
        if (!role) return toast.warn("Hãy chọn vai trò mới!");
        dispatch(updateUserByAdminAsync({ id, data: { role } }));
        setEditingId(null);
        toast.info("Đã cập nhật vai trò!");
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
            dispatch(deleteUserByAdminAsync(id));
            toast.error("Đã xóa người dùng!");
        }
    };

    return (
        <Stack p={is480 ? 2 : 4} rowGap={4}>
            <Typography variant="h4" fontWeight={600}>
                User Management
            </Typography>

            <Grid container spacing={2}>
                {users.map((user) => (
                    <Grid item xs={12} sm={6} md={4} key={user._id}>
                        <Stack
                            border="1px solid #ddd"
                            borderRadius={2}
                            p={2}
                            direction="column"
                            spacing={1}
                        >
                            <Typography variant="body1">{user.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user.email}
                            </Typography>
                            <Typography variant="body2">Role: {user.role}</Typography>

                            {editingId === user._id ? (
                                <Stack direction="row" spacing={1} mt={1}>
                                    <Select
                                        size="small"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <MenuItem value="user">User</MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                    </Select>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => handleUpdateRole(user._id)}
                                    >
                                        Lưu
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        onClick={() => setEditingId(null)}
                                    >
                                        Hủy
                                    </Button>
                                </Stack>
                            ) : (
                                <Stack direction="row" spacing={1} mt={1}>
                                    <IconButton
                                        color="primary"
                                        onClick={() => {
                                            setEditingId(user._id);
                                            setRole(user.role);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(user._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            )}
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
};
