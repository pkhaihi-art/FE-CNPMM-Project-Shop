import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchAllBrands, addBrand, updateBrand, deleteBrand } from './BrandApi'

const initialState = {
    status: "idle",
    brands: [],
    errors: null
}

export const fetchAllBrandsAsync = createAsyncThunk('brands/fetchAllBrandsAsync', async () => {
    const brands = await fetchAllBrands()
    return brands
})

export const addBrandAsync = createAsyncThunk('brands/addBrandAsync', async (brand) => {
    const newBrand = await addBrand(brand)
    return newBrand
})

export const updateBrandAsync = createAsyncThunk('brands/updateBrandAsync', async (update) => {
    const updatedBrand = await updateBrand(update)
    return updatedBrand
})

export const deleteBrandAsync = createAsyncThunk('brands/deleteBrandAsync', async (id) => {
    const deleted = await deleteBrand(id)
    return deleted
})

const brandSlice = createSlice({
    name: "BrandSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllBrandsAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.brands = action.payload
            })
            .addCase(addBrandAsync.fulfilled, (state, action) => {
                state.brands.push(action.payload)
            })
            .addCase(updateBrandAsync.fulfilled, (state, action) => {
                const idx = state.brands.findIndex(b => b._id === action.payload._id)
                if (idx !== -1) state.brands[idx] = action.payload
            })
            .addCase(deleteBrandAsync.fulfilled, (state, action) => {
                state.brands = state.brands.filter(b => b._id !== action.payload._id)
            })
    }
})

// Selectors
export const selectBrandStatus = (state) => state.BrandSlice.status
export const selectBrands = (state) => state.BrandSlice.brands
export const selectBrandErrors = (state) => state.BrandSlice.errors

export default brandSlice.reducer
