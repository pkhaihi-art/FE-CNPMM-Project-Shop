import { axiosi } from "../../config/axios";

export const fetchAllBrands = async () => {
    try {
        const res = await axiosi.get("/brands");
        return res.data;
    } catch (error) {
        throw error.response.data;
    }
};

// 🆕 Thêm thương hiệu
export const addBrand = async (brand) => {
    try {
        const res = await axiosi.post("/brands", brand);
        return res.data;
    } catch (error) {
        throw error.response.data;
    }
};

// ✏️ Cập nhật thương hiệu
export const updateBrand = async ({ id, name }) => {
    try {
        const res = await axiosi.patch(`/brands/${id}`, { name });
        return res.data;
    } catch (error) {
        throw error.response.data;
    }
};

// ❌ Xóa thương hiệu
export const deleteBrand = async (id) => {
    try {
        const res = await axiosi.delete(`/brands/${id}`);
        return res.data;
    } catch (error) {
        throw error.response.data;
    }
};
