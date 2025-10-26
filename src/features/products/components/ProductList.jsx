import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Row,
    Col,
    Space,
    Typography,
    Select,
    Pagination,
    Flex,
    Radio
} from 'antd';
import { fetchProductsAsync, resetProductFetchStatus, selectProductFetchStatus, selectProductTotalResults, selectProducts } from '../ProductSlice';
import { ProductCard } from './ProductCard';
import { selectBrands } from '../../brands/BrandSlice';
import { selectCategories } from '../../categories/CategoriesSlice';
import { ITEMS_PER_PAGE } from '../../../constants';
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, resetWishlistItemAddStatus, resetWishlistItemDeleteStatus, selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { toast } from 'react-toastify';
import { banner1, banner2, banner3, banner4, loadingAnimation } from '../../../assets';
import { resetCartItemAddStatus, selectCartItemAddStatus } from '../../cart/CartSlice';
import { ProductBanner } from './ProductBanner'; // Giả định component này đã được chuyển đổi
import Lottie from 'lottie-react';

const { Text } = Typography;

const sortOptions = [
    { name: "Giá tăng dần", sort: "price", order: "asc" },
    { name: "Giá giảm dần", sort: "price", order: "desc" },
];

const featureOptions = [
    { key: '', label: 'Tất cả' },
    { key: 'newest', label: 'Mới nhất' },
    { key: 'best-selling', label: 'Bán chạy' },
    { key: 'most-viewed', label: 'Xem nhiều' },
    { key: 'highest-discount', label: 'Giảm giá cao' },
];

const bannerImages = [banner1, banner3, banner2, banner4];

export const ProductList = () => {
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState(null);
    const [feature, setFeature] = useState('');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const brands = useSelector(selectBrands);
    const categories = useSelector(selectCategories);
    const products = useSelector(selectProducts);
    const totalResults = useSelector(selectProductTotalResults);
    const loggedInUser = useSelector(selectLoggedInUser);
    const productFetchStatus = useSelector(selectProductFetchStatus);
    const wishlistItems = useSelector(selectWishlistItems);
    const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
    const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);
    const cartItemAddStatus = useSelector(selectCartItemAddStatus);

    const dispatch = useDispatch();

    // Logic handlers (giữ nguyên)
    // Brand filter handler
    const handleBrandChange = (values) => {
        setSelectedBrands(values);
        setFilters({ ...filters, brand: values });
    };

    // Category filter handler
    const handleCategoryChange = (values) => {
        setSelectedCategories(values);
        setFilters({ ...filters, category: values });
    };

    const handleAddRemoveFromWishlist = (e, productId) => {
        if (e?.target?.checked) {
            const data = { user: loggedInUser?._id, product: productId };
            dispatch(createWishlistItemAsync(data));
        } else {
            const index = wishlistItems.findIndex((item) => (item.product && item.product._id) ? item.product._id === productId : item.product === productId);
            if(index !== -1) {
                dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
            }
        }
    };
    
    // useEffect hooks (giữ nguyên)
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    useEffect(() => {
        setPage(1);
    }, [totalResults]);

    useEffect(() => {
        const finalFilters = { ...filters };
        finalFilters['pagination'] = { page: page, limit: ITEMS_PER_PAGE };
        const selectedSort = sortOptions.find((o) => o.name === sort);
        finalFilters['sort'] = selectedSort ? { sort: selectedSort.sort, order: selectedSort.order } : null;
        if (feature) finalFilters['feature'] = feature;
        if (selectedBrands.length) finalFilters['brand'] = selectedBrands;
        if (selectedCategories.length) finalFilters['category'] = selectedCategories;
        if (!loggedInUser?.isAdmin) {
            finalFilters['user'] = true;
        }
        dispatch(fetchProductsAsync(finalFilters));
    }, [filters, page, sort, feature, selectedBrands, selectedCategories, dispatch, loggedInUser?.isAdmin]);

    // Các useEffect xử lý toast (giữ nguyên)
    useEffect(() => {
        if (wishlistItemAddStatus === 'fulfilled') {
            toast.success("Product added to wishlist");
        } else if (wishlistItemAddStatus === 'rejected') {
            toast.error("Error adding product to wishlist, please try again later");
        }
    }, [wishlistItemAddStatus]);

    useEffect(() => {
        if (wishlistItemDeleteStatus === 'fulfilled') {
            toast.success("Product removed from wishlist");
        } else if (wishlistItemDeleteStatus === 'rejected') {
            toast.error("Error removing product from wishlist, please try again later");
        }
    }, [wishlistItemDeleteStatus]);

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            toast.success("Product added to cart");
        } else if (cartItemAddStatus === 'rejected') {
            toast.error("Error adding product to cart, please try again later");
        }
    }, [cartItemAddStatus]);

    useEffect(() => {
        if (productFetchStatus === 'rejected') {
            toast.error("Error fetching products, please try again later");
        }
    }, [productFetchStatus]);

    // Cleanup useEffect (giữ nguyên)
    useEffect(() => {
        return () => {
            dispatch(resetProductFetchStatus());
            dispatch(resetWishlistItemAddStatus());
            dispatch(resetWishlistItemDeleteStatus());
            dispatch(resetCartItemAddStatus());
        };
    }, [dispatch]);


    // Render loading
    if (productFetchStatus === 'pending') {
        return (
            <Flex justify="center" align="center" style={{ height: 'calc(100vh - 4rem)' }}>
                <Lottie 
                    animationData={loadingAnimation} 
                    style={{ width: '25rem' }} 
                />
            </Flex>
        );
    }

    return (
        <>
            {/* Filter Bar UI */}
            <Flex wrap="wrap" gap="large" align="center" style={{ marginBottom: 24, background: '#f5f5f5', padding: '16px 24px', borderRadius: 12 }}>
                {/* Feature filter */}
                <Radio.Group value={feature} onChange={e => setFeature(e.target.value)}>
                    {featureOptions.map(opt => (
                        <Radio.Button key={opt.key} value={opt.key}>{opt.label}</Radio.Button>
                    ))}
                </Radio.Group>

                {/* Brand filter */}
                <Select
                    mode="multiple"
                    allowClear
                    placeholder="Chọn thương hiệu"
                    style={{ minWidth: 180 }}
                    value={selectedBrands}
                    onChange={handleBrandChange}
                >
                    {brands.map(brand => (
                        <Select.Option key={brand._id} value={brand._id}>{brand.name}</Select.Option>
                    ))}
                </Select>

                {/* Category filter */}
                <Select
                    mode="multiple"
                    allowClear
                    placeholder="Chọn danh mục"
                    style={{ minWidth: 180 }}
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                >
                    {categories.map(category => (
                        <Select.Option key={category._id} value={category._id}>{category.name}</Select.Option>
                    ))}
                </Select>

                {/* Sort filter */}
                <Select
                    placeholder="Sắp xếp"
                    style={{ minWidth: 140 }}
                    onChange={value => setSort(value)}
                    value={sort}
                    allowClear
                >
                    {sortOptions.map(option => (
                        <Select.Option key={option.name} value={option.name}>{option.name}</Select.Option>
                    ))}
                </Select>
            </Flex>

            {/* Main Content */}
            <Space direction="vertical" size="large" style={{ width: '100%', marginBottom: '3rem' }}>
                
                {/* banners section */}
                <div style={{ width: "100%", height: "400px" }}>
                    <ProductBanner images={bannerImages} />
                </div>

                {/* products */}
                <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '1rem' }}>
                    
                    {/* sort options */}
                    <Flex justify="flex-end" style={{ paddingRight: '2rem' }}>
                        <Select
                            placeholder="Sort by"
                            style={{ width: '12rem' }}
                            onChange={(value) => setSort(value)} // AntD Select truyền value trực tiếp (we store option.name)
                            value={sort}
                            allowClear // Thay thế cho MenuItem 'Reset'
                        >
                            {sortOptions.map((option) => (
                                <Select.Option key={option.name} value={option.name}>{option.name}</Select.Option>
                            ))}
                        </Select>
                    </Flex>

                    {/* product grid */}
                    <Row gutter={[16, 16]} justify="center" style={{ padding: '0 1rem' }}>
                        {products.map((product) => (
                            <Col key={product._id}>
                                <ProductCard
                                    id={product._id}
                                    title={product.title}
                                    thumbnail={product.thumbnail}
                                    brand={product.brand.name}
                                    price={product.price}
                                    discountPercentage={product.discountPercentage}
                                    handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                                />
                            </Col>
                        ))}
                    </Row>

                    {/* pagination */}
                    <Flex 
                        vertical 
                        align={'flex-end'}
                        gap="middle" 
                        style={{ paddingRight: '2.5rem' }}
                    >
                        <Pagination
                            size={'large'}
                            current={page}
                            onChange={(page) => setPage(page)}
                            total={totalResults}
                            pageSize={ITEMS_PER_PAGE}
                            showSizeChanger={false}
                        />
                        <Text>
                            Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {page * ITEMS_PER_PAGE > totalResults ? totalResults : page * ITEMS_PER_PAGE} of {totalResults} results
                        </Text>
                    </Flex>
                </Space>
            </Space>
        </>
    );
};