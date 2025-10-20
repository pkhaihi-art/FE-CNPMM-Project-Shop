import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchAllBrandsAsync,
    addBrandAsync,
    updateBrandAsync,
    deleteBrandAsync,
    selectBrands
} from '../../brands/BrandSlice'
import {
    Stack, Typography, TextField, Button, Grid, IconButton, useTheme, useMediaQuery
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'

export const AdminBrand = () => {
    const dispatch = useDispatch()
    const brands = useSelector(selectBrands)
    const [newBrand, setNewBrand] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editValue, setEditValue] = useState('')
    const theme = useTheme()
    const is480 = useMediaQuery(theme.breakpoints.down(480))

    useEffect(() => {
        dispatch(fetchAllBrandsAsync())
    }, [dispatch])

    const handleAdd = () => {
        if (!newBrand.trim()) return toast.warn('Tên thương hiệu không được để trống')
        dispatch(addBrandAsync({ name: newBrand }))
        setNewBrand('')
        toast.success('Đã thêm thương hiệu!')
    }

    const handleUpdate = (id) => {
        if (!editValue.trim()) return toast.warn('Tên mới không được để trống')
        dispatch(updateBrandAsync({ id, name: editValue }))
        setEditingId(null)
        toast.info('Đã cập nhật thương hiệu!')
    }

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa thương hiệu này?')) {
            dispatch(deleteBrandAsync(id))
            toast.error('Đã xóa thương hiệu!')
        }
    }

    return (
        <Stack p={is480 ? 2 : 4} rowGap={4}>
            <Typography variant='h4' fontWeight={600}>Brand Management</Typography>

            {/* Thêm thương hiệu */}
            <Stack direction='row' spacing={2}>
                <TextField
                    label='Tên thương hiệu mới'
                    variant='outlined'
                    size='small'
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                />
                <Button variant='contained' onClick={handleAdd}>Thêm</Button>
            </Stack>

            {/* Danh sách thương hiệu */}
            <Grid container spacing={2}>
                {brands.map((brand) => (
                    <Grid item xs={12} sm={6} md={4} key={brand._id}>
                        <Stack
                            border='1px solid #ddd'
                            borderRadius={2}
                            p={2}
                            direction='row'
                            justifyContent='space-between'
                            alignItems='center'
                        >
                            {editingId === brand._id ? (
                                <Stack direction='row' spacing={1}>
                                    <TextField
                                        size='small'
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                    />
                                    <Button size='small' variant='contained' onClick={() => handleUpdate(brand._id)}>Lưu</Button>
                                    <Button size='small' variant='outlined' color='error' onClick={() => setEditingId(null)}>Hủy</Button>
                                </Stack>
                            ) : (
                                <>
                                    <Typography>{brand.name}</Typography>
                                    <Stack direction='row'>
                                        <IconButton color='primary' onClick={() => {
                                            setEditingId(brand._id)
                                            setEditValue(brand.name)
                                        }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color='error' onClick={() => handleDelete(brand._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                </>
                            )}
                        </Stack>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    )
}
