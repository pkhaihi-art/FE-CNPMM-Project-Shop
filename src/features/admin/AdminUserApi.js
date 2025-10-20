import { axiosi } from "../../config/axios";

// Lấy tất cả người dùng (admin)
export const fetchAllUsers = async () => {
    const res = await axiosi.get("/users");
    return res.data;
};

// Lấy chi tiết 1 user
export const fetchUserById = async (id) => {
    const res = await axiosi.get(`/users/admin/${id}`);
    return res.data;
};

// Cập nhật user
export const updateUserByAdmin = async ({ id, data }) => {
    const res = await axiosi.patch(`/users/admin/${id}`, data);
    return res.data;
};

// Xóa user
export const deleteUserByAdmin = async (id) => {
    const res = await axiosi.delete(`/users/admin/${id}`);
    return res.data;
};
