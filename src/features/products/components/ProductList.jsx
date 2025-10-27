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
    Radio,
    Input
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { fetchProductsAsync, resetProductFetchStatus, selectProductFetchStatus, selectProductTotalResults, selectProducts, searchProductsAsync, selectSearchResults, selectProductSearchStatus, clearSearchResults } from '../ProductSlice';
import { ProductCard } from './ProductCard';
import { selectBrands } from '../../brands/BrandSlice';
import { selectCategories } from '../../categories/CategoriesSlice';
import { ITEMS_PER_PAGE } from '../../../constants';
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, resetWishlistItemAddStatus, resetWishlistItemDeleteStatus, selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { toast } from 'react-toastify';
import { banner1, banner2, banner3, banner4, loadingAnimation } from '../../../assets';
import { resetCartItemAddStatus, selectCartItemAddStatus } from '../../cart/CartSlice';
import { ProductBanner } from './ProductBanner';
import Lottie from 'lottie-react';

const { Text } = Typography;
const { Search } = Input;

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
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState(null);
    const [feature, setFeature] = useState('');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(false);
    
    const wishlistAddStatus = useSelector(selectWishlistItemAddStatus);
    const wishlistDeleteStatus = useSelector(selectWishlistItemDeleteStatus);
    const cartAddStatus = useSelector(selectCartItemAddStatus);

    const brands = useSelector(selectBrands);
    const categories = useSelector(selectCategories);
    const products = useSelector(selectProducts);
    const searchResults = useSelector(selectSearchResults);
    const totalResults = useSelector(selectProductTotalResults);
    const loggedInUser = useSelector(selectLoggedInUser);
    const productFetchStatus = useSelector(selectProductFetchStatus);
    const searchStatus = useSelector(selectProductSearchStatus);
    const wishlistItems = useSelector(selectWishlistItems);

    // Xác định products hiển thị dựa trên mode
    const displayProducts = isSearchMode ? searchResults : products;
    const displayStatus = isSearchMode ? searchStatus : productFetchStatus;

    // Reset status after operations complete
    useEffect(() => {
        if (wishlistAddStatus === 'fulfilled') {
            dispatch(resetWishlistItemAddStatus());
        }
        if (wishlistDeleteStatus === 'fulfilled') {
            dispatch(resetWishlistItemDeleteStatus());
        }
        if (cartAddStatus === 'fulfilled') {
            dispatch(resetCartItemAddStatus());
        }
    }, [wishlistAddStatus, wishlistDeleteStatus, cartAddStatus, dispatch]);

    // Debounce search
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setIsSearchMode(false);
            dispatch(clearSearchResults());
            return;
        }

        const timer = setTimeout(() => {
            setIsSearchMode(true);
            setPage(1); // Reset về trang 1 khi search
            dispatch(searchProductsAsync(searchQuery));
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, dispatch]);

    const handleBrandChange = (values) => {
        setSelectedBrands(values);
        setPage(1);
        setSearchQuery(''); // Clear search khi filter
        setIsSearchMode(false);
    };

    const handleCategoryChange = (values) => {
        setSelectedCategories(values);
        setPage(1);
        setSearchQuery(''); // Clear search khi filter
        setIsSearchMode(false);
    };

    const handleFeatureChange = (e) => {
        setFeature(e.target.value);
        setPage(1);
        setSearchQuery(''); // Clear search khi filter
        setIsSearchMode(false);
    };

    const handleSortChange = (value) => {
        setSort(value);
        setPage(1);
        setSearchQuery(''); // Clear search khi filter
        setIsSearchMode(false);
    };

    const handleSearchClear = () => {
        setSearchQuery('');
        setIsSearchMode(false);
        dispatch(clearSearchResults());
    };

    const handleAddRemoveFromWishlist = async (e, productId) => {
        e.preventDefault();

        if (!loggedInUser) {
            toast.error("Vui lòng đăng nhập để thực hiện chức năng này");
            return;
        }

        const isInWishlist = wishlistItems.some((item) => 
            (item.product && item.product._id) ? item.product._id === productId : item.product === productId
        );

        try {
            if (isInWishlist) {
                const wishlistItem = wishlistItems.find((item) => 
                    (item.product && item.product._id) ? item.product._id === productId : item.product === productId
                );
                if (wishlistItem?._id) {
                    await dispatch(deleteWishlistItemByIdAsync(wishlistItem._id)).unwrap();
                    toast.success("Đã xóa khỏi danh sách yêu thích");
                }
            } else {
                const data = {
                    user: loggedInUser._id,
                    product: productId
                };
                await dispatch(createWishlistItemAsync(data)).unwrap();
                toast.success("Đã thêm vào danh sách yêu thích");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra. Vui lòng thử lại");
        }
    };
    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    // Fetch products khi KHÔNG ở search mode
    useEffect(() => {
        if (isSearchMode) return; // Skip nếu đang search

        const finalFilters = {};
        
        finalFilters['pagination'] = { page, limit: ITEMS_PER_PAGE };
        
        const selectedSort = sortOptions.find((o) => o.name === sort);
        if (selectedSort) {
            finalFilters['sort'] = { sort: selectedSort.sort, order: selectedSort.order };
        }
        
        if (feature) finalFilters['feature'] = feature;
        if (selectedBrands.length) finalFilters['brand'] = selectedBrands;
        if (selectedCategories.length) finalFilters['category'] = selectedCategories;
        
        if (!loggedInUser?.isAdmin) {
            finalFilters['user'] = true;
        }
        
        dispatch(fetchProductsAsync(finalFilters));
    }, [page, sort, feature, selectedBrands, selectedCategories, loggedInUser, isSearchMode, dispatch]);

    useEffect(() => {
        if (productFetchStatus === 'rejected') {
            toast.error("Lỗi tải sản phẩm, vui lòng thử lại");
        }
        if (searchStatus === 'rejected') {
            toast.error("Lỗi tìm kiếm, vui lòng thử lại");
        }
    }, [productFetchStatus, searchStatus]);

    useEffect(() => {
        return () => {
            dispatch(resetProductFetchStatus());
            dispatch(resetWishlistItemAddStatus());
            dispatch(resetWishlistItemDeleteStatus());
            dispatch(resetCartItemAddStatus());
            dispatch(clearSearchResults());
        };
    }, [dispatch]);

    if (displayStatus === 'pending') {
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
            {/* Search Bar */}
            <Flex justify="center" style={{ marginBottom: 24, padding: '0 24px' }}>
                <Search
                    placeholder="Tìm kiếm sản phẩm theo tên..."
                    size="large"
                    prefix={<SearchOutlined />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onSearch={(value) => {
                        if (value.trim()) {
                            setIsSearchMode(true);
                            dispatch(searchProductsAsync(value));
                        }
                    }}
                    allowClear
                    onClear={handleSearchClear}
                    style={{ maxWidth: '600px', width: '100%' }}
                    enterButton="Tìm kiếm"
                />
            </Flex>

            {/* Search Results Info */}
            {isSearchMode && (
                <Flex justify="center" style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: '16px', color: '#1890ff' }}>
                        {displayProducts.length > 0 
                            ? `Tìm thấy ${displayProducts.length} kết quả cho "${searchQuery}"`
                            : `Không tìm thấy kết quả cho "${searchQuery}"`
                        }
                    </Text>
                </Flex>
            )}

            {/* Filter Bar - Chỉ hiện khi KHÔNG search */}
            {!isSearchMode && (
                <Flex wrap="wrap" gap="large" align="center" style={{ marginBottom: 24, background: '#f5f5f5', padding: '16px 24px', borderRadius: 12 }}>
                    {/* Feature filter */}
                    <Radio.Group value={feature} onChange={handleFeatureChange}>
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
                        onChange={handleSortChange}
                        value={sort}
                        allowClear
                    >
                        {sortOptions.map(option => (
                            <Select.Option key={option.name} value={option.name}>{option.name}</Select.Option>
                        ))}
                    </Select>
                </Flex>
            )}

            {/* Main Content */}
            <Space direction="vertical" size="large" style={{ width: '100%', marginBottom: '3rem' }}>
                
                {/* banners section - Chỉ hiện khi KHÔNG search */}
                {!isSearchMode && (
                    <div style={{ width: "100%", height: "400px" }}>
                        <ProductBanner images={bannerImages} />
                    </div>
                )}

                {/* products */}
                <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '1rem' }}>
                    
                    {/* product grid */}
                    {displayProducts.length > 0 ? (
                        <Row gutter={[16, 16]} justify="center" style={{ padding: '0 1rem' }}>
                            {displayProducts.map((product) => {
                                // Xử lý data structure khác nhau giữa search và fetch
                                const productId = product.id || product._id;
                                const brandName = product.brand?.name || product.brand || 'N/A';
                                
                                return (
                                    <Col key={productId}>
                                        <ProductCard
                                            id={productId}
                                            title={product.title}
                                            thumbnail={product.thumbnail}
                                            brand={brandName}
                                            price={product.price}
                                            discountPercentage={product.discountPercentage}
                                            handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                                        />
                                    </Col>
                                );
                            })}
                        </Row>
                    ) : (
                        <Flex justify="center" align="center" style={{ minHeight: '300px' }}>
                            <Text style={{ fontSize: '18px', color: '#999' }}>
                                {isSearchMode ? 'Không tìm thấy sản phẩm phù hợp' : 'Không có sản phẩm'}
                            </Text>
                        </Flex>
                    )}

                    {/* pagination - Chỉ hiện khi KHÔNG search */}
                    {!isSearchMode && displayProducts.length > 0 && (
                        <Flex 
                            vertical 
                            align={'flex-end'}
                            gap="middle" 
                            style={{ paddingRight: '2.5rem' }}
                        >
                            <Pagination
                                size={'large'}
                                current={page}
                                onChange={(newPage) => setPage(newPage)}
                                total={totalResults}
                                pageSize={ITEMS_PER_PAGE}
                                showSizeChanger={false}
                            />
                            <Text>
                                Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {page * ITEMS_PER_PAGE > totalResults ? totalResults : page * ITEMS_PER_PAGE} of {totalResults} results
                            </Text>
                        </Flex>
                    )}

                    {/* Search results count */}
                    {isSearchMode && displayProducts.length > 0 && (
                        <Flex justify="center">
                            <Text style={{ color: '#666' }}>
                                Hiển thị {displayProducts.length} kết quả
                            </Text>
                        </Flex>
                    )}
                </Space>
            </Space>
        </>
    );
};