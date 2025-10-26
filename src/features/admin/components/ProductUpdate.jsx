import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { 
    clearSelectedProduct, 
    fetchProductByIdAsync, 
    resetProductUpdateStatus, 
    selectProductUpdateStatus, 
    selectSelectedProduct, 
    updateProductByIdAsync 
} from '../../products/ProductSlice'
import { 
    Button, 
    Form, 
    Input, 
    Select, 
    Space, 
    Typography, 
    Flex, 
    Row, 
    Col, 
    Grid, 
    message,
    InputNumber,
    Modal
} from 'antd'
import { PlusOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { useForm, Controller } from "react-hook-form"
import { selectBrands } from '../../brands/BrandSlice'
import { selectCategories } from '../../categories/CategoriesSlice'
// import { toast } from 'react-toastify' // Replaced with AntD 'message'

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

export const ProductUpdate = () => {

    const { handleSubmit, control, formState: { errors }, reset } = useForm();

    const { id } = useParams();
    const dispatch = useDispatch();
    const selectedProduct = useSelector(selectSelectedProduct);
    const brands = useSelector(selectBrands) || [];
    const categories = useSelector(selectCategories) || [];
    const productUpdateStatus = useSelector(selectProductUpdateStatus);
    const navigate = useNavigate();
    const screens = useBreakpoint(); // AntD's hook for responsiveness
    const [imageCount, setImageCount] = useState(0);
    
    // Preview image state
    const [previews, setPreviews] = useState({});
    const [loadingPreviews, setLoadingPreviews] = useState({});

    // Handle image preview
    const handlePreview = useCallback(async (url, index) => {
        if (!url) {
            setPreviews(prev => ({ ...prev, [index]: null }));
            return;
        }

        setLoadingPreviews(prev => ({ ...prev, [index]: true }));
        try {
            // Test if image loads successfully
            await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = url;
            });
            setPreviews(prev => ({ ...prev, [index]: url }));
        } catch (error) {
            message.error(`Invalid image URL for Image ${index + 1}`);
            setPreviews(prev => ({ ...prev, [index]: null }));
        }
        setLoadingPreviews(prev => ({ ...prev, [index]: false }));
    }, []);

    // Handle image removal
    const handleRemoveImage = (index) => {
        Modal.confirm({
            title: 'Remove Image',
            content: 'Are you sure you want to remove this image?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                // Clear the form field
                const newValues = { ...control._formValues };
                delete newValues[`image${index}`];
                reset(newValues);
                
                // Clear preview
                setPreviews(prev => {
                    const newPreviews = { ...prev };
                    delete newPreviews[index];
                    return newPreviews;
                });
                
                // Update image count and shift remaining images
                const remainingImages = Array.from({ length: imageCount })
                    .map((_, i) => i === index ? null : control._formValues[`image${i}`])
                    .filter(Boolean);
                
                // Reset form with shifted values
                const shiftedValues = { ...control._formValues };
                remainingImages.forEach((img, i) => {
                    shiftedValues[`image${i}`] = img;
                });
                for (let i = remainingImages.length; i < imageCount; i++) {
                    delete shiftedValues[`image${i}`];
                }
                reset(shiftedValues);
                setImageCount(remainingImages.length);
                
                message.success('Image removed successfully');
            }
        });
    };

    // Update previews when image URLs change
    useEffect(() => {
        const formValues = control._formValues;
        if (formValues) {
            Object.keys(formValues)
                .filter(key => key.startsWith('image'))
                .forEach(key => {
                    const index = parseInt(key.replace('image', ''));
                    handlePreview(formValues[key], index);
                });
        }
    }, [control._formValues, handlePreview]);

    // Helper variables for responsiveness
    const isExtraSmallScreen = !screens.sm; // Example: equivalent to < 576px (replaces is480)
    const formWidth = !screens.lg ? '100%' : '60rem'; // Replaces is1100

    // Fetch product data on load
    useEffect(() => {
        if (id) {
            dispatch(fetchProductByIdAsync(id));
        }
    }, [id, dispatch]);

    // Pre-fill the form once the selectedProduct data is available
    useEffect(() => {
        if (selectedProduct) {
            const defaultValues = {
                title: selectedProduct.title || '',
                brand: selectedProduct.brand?._id || '',
                category: selectedProduct.category?._id || '',
                description: selectedProduct.description || '',
                price: selectedProduct.price ?? 0,
                discountPercentage: selectedProduct.discountPercentage ?? 0,
                stockQuantity: selectedProduct.stockQuantity ?? 0,
                thumbnail: selectedProduct.thumbnail || '',
            };

            // Dynamically add image fields to default values (images may be undefined)
            const existingImages = selectedProduct.images || [];
            existingImages.forEach((image, index) => {
                defaultValues[`image${index}`] = image;
            });

            // initialize dynamic image field count
            setImageCount(existingImages.length || 0);

            reset(defaultValues);
        }
    }, [selectedProduct, reset]);

    // Handle update status with AntD messages
    useEffect(() => {
        if (productUpdateStatus === 'fulfilled') {
            message.success("Product Updated");
            navigate("/admin/dashboard");
        } else if (productUpdateStatus === 'rejected') {
            message.error("Error updating product, please try again later");
        }
    }, [productUpdateStatus, navigate]);

    // Cleanup effect
    useEffect(() => {
        return () => {
            dispatch(clearSelectedProduct());
            dispatch(resetProductUpdateStatus());
        }
    }, [dispatch]);

    const handleProductUpdate = async (data) => {
        try {
                // Collect all image data from form (including newly added ones)
            const images = [];
                for (let i = 0; i < imageCount; i++) {
                if (data[`image${i}`]) {
                    images.push(data[`image${i}`]);
                }
            }

                // Create update object
                const updates = {
                    title: data.title,
                    brand: data.brand,
                    category: data.category,
                    description: data.description,
                    price: data.price,
                    discountPercentage: data.discountPercentage,
                    stockQuantity: data.stockQuantity,
                    thumbnail: data.thumbnail,
                    images: images
                };

            // Only include images if they've changed

            // Only update if there are changes
                await dispatch(updateProductByIdAsync({
                    _id: selectedProduct._id,
                    ...updates
                })).unwrap();
                message.success('Product updated successfully');
                navigate('/admin/dashboard');
        } catch (error) {
            message.error(error.message || 'Failed to update product');
        }
    };

    return (
        <Flex justify="center" align="center" style={{ padding: '0 16px', minHeight: '90vh' }}>
            
            {selectedProduct &&
            
            <Form
                layout="vertical"
                onFinish={handleSubmit(handleProductUpdate)}
                style={{
                    width: formWidth,
                    marginTop: isExtraSmallScreen ? 32 : 48,
                    marginBottom: 48,
                }}
            >
                <Title level={3} style={{textAlign: 'center', marginBottom: 32}}>Update Product</Title>

                {/* --- Field Area --- */}
                <Space direction="vertical" size="large" style={{ width: '100%' }}>

                    {/* Title */}
                    <Form.Item
                        label="Title"
                        validateStatus={errors.title ? 'error' : ''}
                        help={errors.title?.message}
                    >
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: 'Title is required' }}
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>

                    {/* Brand and Category */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Brand"
                                validateStatus={errors.brand ? 'error' : ''}
                                help={errors.brand?.message}
                            >
                                <Controller
                                    name="brand"
                                    control={control}
                                    rules={{ required: 'Brand is required' }}
                                    render={({ field }) => (
                                        <Select {...field} placeholder="Select Brand">
                                            {brands.map((brand) => (
                                                <Option key={brand._id} value={brand._id}>{brand.name}</Option>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Category"
                                validateStatus={errors.category ? 'error' : ''}
                                help={errors.category?.message}
                            >
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: 'Category is required' }}
                                    render={({ field }) => (
                                        <Select {...field} placeholder="Select Category">
                                            {categories.map((category) => (
                                                <Option key={category._id} value={category._id}>{category.name}</Option>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Description */}
                    <Form.Item
                        label="Description"
                        validateStatus={errors.description ? 'error' : ''}
                        help={errors.description?.message}
                    >
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: 'Description is required' }}
                            render={({ field }) => <TextArea {...field} rows={4} />}
                        />
                    </Form.Item>

                    {/* Price and Discount */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Price"
                                validateStatus={errors.price ? 'error' : ''}
                                help={errors.price?.message}
                            >
                                <Controller
                                    name="price"
                                    control={control}
                                    rules={{ required: 'Price is required' }}
                                    render={({ field }) => <InputNumber {...field} style={{ width: '100%' }} min={0} />}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={`Discount ${isExtraSmallScreen ? "%" : "Percentage"}`}
                                validateStatus={errors.discountPercentage ? 'error' : ''}
                                help={errors.discountPercentage?.message}
                            >
                                <Controller
                                    name="discountPercentage"
                                    control={control}
                                    rules={{ required: 'Discount percentage is required' }}
                                    render={({ field }) => <InputNumber {...field} style={{ width: '100%' }} min={0} max={100} />}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Stock Quantity */}
                    <Form.Item
                        label="Stock Quantity"
                        validateStatus={errors.stockQuantity ? 'error' : ''}
                        help={errors.stockQuantity?.message}
                    >
                        <Controller
                            name="stockQuantity"
                            control={control}
                            rules={{ required: 'Stock Quantity is required' }}
                            render={({ field }) => <InputNumber {...field} style={{ width: '100%' }} min={0} />}
                        />
                    </Form.Item>

                    {/* Thumbnail */}
                    <Form.Item
                        label="Thumbnail"
                        validateStatus={errors.thumbnail ? 'error' : ''}
                        help={errors.thumbnail?.message}
                    >
                        <Controller
                            name="thumbnail"
                            control={control}
                            rules={{ required: 'Thumbnail is required' }}
                            render={({ field }) => <Input {...field} placeholder="Thumbnail Image URL" aria-label="Thumbnail Image URL" />}
                        />
                    </Form.Item>

                    {/* Product Images */}
                    <div>
                        <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                            <Title level={5} style={{ margin: 0 }}>Product Images</Title>
                            <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setImageCount((c) => c + 1);
                                }}
                            >
                                Add Image
                            </Button>
                        </Flex>
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {Array.from({ length: imageCount }).map((_, index) => (
                                <Form.Item
                                    key={index}
                                    style={{ marginBottom: 0 }}
                                    validateStatus={errors[`image${index}`] ? 'error' : ''}
                                    help={errors[`image${index}`]?.message}
                                >
                                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                                        <Flex gap="small" align="start">
                                            <Controller
                                                name={`image${index}`}
                                                control={control}
                                                rules={{ required: 'Image URL is required' }}
                                                render={({ field }) => (
                                                    <Input 
                                                        {...field}
                                                        placeholder={`Image URL ${index + 1}`}
                                                        aria-label={`Image URL ${index + 1}`}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            handlePreview(e.target.value, index);
                                                        }}
                                                        style={{ flex: 1 }}
                                                    />
                                                )}
                                            />
                                            <Button
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleRemoveImage(index)}
                                            />
                                        </Flex>
                                        
                                        {/* Image Preview */}
                                        {loadingPreviews[index] ? (
                                            <Flex justify="center" align="center" style={{ height: 100, width: '100%' }}>
                                                <LoadingOutlined style={{ fontSize: 24 }} spin />
                                            </Flex>
                                        ) : previews[index] && (
                                            <img
                                                src={previews[index]}
                                                alt={`Preview ${index + 1}`}
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: 200,
                                                    objectFit: 'contain',
                                                    borderRadius: 8,
                                                    border: '1px solid #d9d9d9'
                                                }}
                                            />
                                        )}
                                    </Space>
                                </Form.Item>
                            ))}
                        </Space>
                    </div>

                </Space>

                {/* --- Action Area --- */}
                <Form.Item style={{ textAlign: 'right', marginTop: 32 }}>
                    <Space size={isExtraSmallScreen ? 8 : 16}>
                        <Button 
                            size={isExtraSmallScreen ? 'medium' : 'large'} 
                            type="primary" 
                            htmlType="submit"
                        >
                            Update
                        </Button>
                        <Link to={'/admin/dashboard'}>
                            <Button 
                                size={isExtraSmallScreen ? 'medium' : 'large'} 
                                danger
                            >
                                Cancel
                            </Button>
                        </Link>
                    </Space>
                </Form.Item>

            </Form>
            }

        </Flex>
    )
}