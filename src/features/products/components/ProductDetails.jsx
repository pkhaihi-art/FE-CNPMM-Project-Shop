import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    clearSelectedProduct,
    fetchProductByIdAsync,
    resetProductFetchStatus,
    selectProductFetchStatus,
    selectSelectedProduct
} from '../ProductSlice';
import {
    Row,
    Col,
    Space,
    Typography,
    Rate,
    Tag,
    Button,
    Divider,
    Card,
    Image,
    Carousel,
    Grid,
    Flex,
    Tooltip
} from 'antd';
import {
    HeartOutlined,
    HeartFilled,
    CarOutlined,
    UndoOutlined,
    LeftOutlined,
    RightOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import { addToCartAsync, resetCartItemAddStatus, selectCartItemAddStatus, selectCartItems } from '../../cart/CartSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import {
    fetchReviewsByProductIdAsync,
    resetReviewFetchStatus,
    selectReviewFetchStatus,
    selectReviews,
} from '../../review/ReviewSlice';
import { Reviews } from '../../review/components/Reviews';
import { toast } from 'react-toastify';
import { MotionConfig, motion } from 'framer-motion';
import {
    createWishlistItemAsync,
    deleteWishlistItemByIdAsync,
    resetWishlistItemAddStatus,
    resetWishlistItemDeleteStatus,
    selectWishlistItemAddStatus,
    selectWishlistItemDeleteStatus,
    selectWishlistItems
} from '../../wishlist/WishlistSlice';
import Lottie from 'lottie-react';
import { loadingAnimation } from '../../../assets';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = ['#020202', '#F6F6F6', '#B82222', '#BEA9A9', '#E2BB8D'];

// Các thuộc tính cho motion
const motionProps = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 1 }
};

export const ProductDetails = () => {
    const { id } = useParams();
    const product = useSelector(selectSelectedProduct);
    const loggedInUser = useSelector(selectLoggedInUser);
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const cartItemAddStatus = useSelector(selectCartItemAddStatus);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColorIndex, setSelectedColorIndex] = useState(-1);
    const reviews = useSelector(selectReviews);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    
    // Hook responsive của AntD
    const screens = useBreakpoint();
    const carouselRef = useRef(null); // Ref cho Carousel

    const wishlistItems = useSelector(selectWishlistItems);

    const isProductAlreadyInCart = cartItems.some((item) => (item.product && item.product._id) ? item.product._id === id : item.product === id);
    const isProductAlreadyinWishlist = wishlistItems.some((item) => (item.product && item.product._id) ? item.product._id === id : item.product === id);

    const productFetchStatus = useSelector(selectProductFetchStatus);
    const reviewFetchStatus = useSelector(selectReviewFetchStatus);

    const totalReviewRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? parseInt(Math.ceil(totalReviewRating / totalReviews)) : 0;

    const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
    const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);
    
    const navigate = useNavigate();

    // Tất cả các useEffect (logic) được giữ nguyên
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);
    
    useEffect(() => {
        if (id) {
            dispatch(fetchProductByIdAsync(id));
            dispatch(fetchReviewsByProductIdAsync(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            toast.success("Product added to cart");
        } else if (cartItemAddStatus === 'rejected') {
            toast.error('Error adding product to cart, please try again later');
        }
        dispatch(resetCartItemAddStatus()); // Reset ngay sau khi hiển thị
    }, [cartItemAddStatus, dispatch]);

    useEffect(() => {
        if (wishlistItemAddStatus === 'fulfilled') {
            toast.success("Product added to wishlist");
        } else if (wishlistItemAddStatus === 'rejected') {
            toast.error("Error adding product to wishlist, please try again later");
        }
        dispatch(resetWishlistItemAddStatus());
    }, [wishlistItemAddStatus, dispatch]);

    useEffect(() => {
        if (wishlistItemDeleteStatus === 'fulfilled') {
            toast.success("Product removed from wishlist");
        } else if (wishlistItemDeleteStatus === 'rejected') {
            toast.error("Error removing product from wishlist, please try again later");
        }
        dispatch(resetWishlistItemDeleteStatus());
    }, [wishlistItemDeleteStatus, dispatch]);

    useEffect(() => {
        if (productFetchStatus === 'rejected') {
            toast.error("Error fetching product details, please try again later");
        }
    }, [productFetchStatus]);

    useEffect(() => {
        if (reviewFetchStatus === 'rejected') {
            toast.error("Error fetching product reviews, please try again later");
        }
    }, [reviewFetchStatus]);

    useEffect(() => {
        return () => {
            dispatch(clearSelectedProduct());
            dispatch(resetProductFetchStatus());
            dispatch(resetReviewFetchStatus());
            dispatch(resetWishlistItemDeleteStatus());
            dispatch(resetWishlistItemAddStatus());
            dispatch(resetCartItemAddStatus());
        };
    }, [dispatch]);

    // Handlers (logic) giữ nguyên
    const handleAddToCart = () => {
        const item = { user: loggedInUser._id, product: id, quantity };
        dispatch(addToCartAsync(item));
        setQuantity(1);
    };

    const handleDecreaseQty = () => {
        if (quantity !== 1) {
            setQuantity(quantity - 1);
        }
    };
    
    const handleIncreaseQty = () => {
        if (quantity < 20 && quantity < product.stockQuantity) {
            setQuantity(quantity + 1);
        }
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    // Handler này được điều chỉnh để không phụ thuộc vào `e.target.checked`
    const handleWishlistToggle = () => {
        if (isProductAlreadyinWishlist) {
            const index = wishlistItems.findIndex((item) => (item.product && item.product._id) ? item.product._id === id : item.product === id);
            if (index !== -1) {
                dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
            }
        } else {
            const data = { user: loggedInUser?._id, product: id };
            dispatch(createWishlistItemAsync(data));
        }
    };

    // Render loading
    if ((productFetchStatus === 'pending' || reviewFetchStatus === 'pending') && !product) {
        return (
            <Flex justify="center" align="center" style={{ height: 'calc(100vh - 4rem)' }}>
                <Lottie animationData={loadingAnimation} style={{ width: screens.xs ? '35vh' : '25rem' }} />
            </Flex>
        );
    }

    // Render lỗi (nếu cần)
    if (productFetchStatus === 'rejected' && reviewFetchStatus === 'rejected') {
        return (
            <Flex justify="center" align="center" style={{ height: 'calc(100vh - 4rem)' }}>
                <Title level={3} type="danger">Không thể tải chi tiết sản phẩm.</Title>
            </Flex>
        );
    }
    
    // Render nội dung
    return (
        product && (
            <div style={{ maxWidth: '88rem', margin: '0 auto', padding: screens.sm ? '2rem' : '1rem' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    
                    {/* Chi tiết sản phẩm */}
                    <Row 
                        gutter={[{ xs: 16, sm: 24, md: 48 }, 48]} 
                        justify="center"
                    >
                        {/* Cột trái (Hình ảnh) */}
                        <Col xs={24} lg={14}>
                            {/* Logic hiển thị hình ảnh:
                                - Màn hình lớn (lg trở lên): Thumbnail list + Hình ảnh chính
                                - Màn hình nhỏ (dưới lg): Carousel
                            */}
                            {screens.lg ? (
                                <Row gutter={24}>
                                    <Col span={4}>
                                        <Space 
                                            direction="vertical" 
                                            size="middle" 
                                            style={{ maxHeight: '50rem', overflowY: 'auto', paddingRight: '8px' }}
                                        >
                                            {product.images.map((image, index) => (
                                                <motion.div {...motionProps} key={index}>
                                                    <Image
                                                        src={image}
                                                        alt={`${product.title} thumbnail ${index}`}
                                                        preview={false}
                                                        onClick={() => setSelectedImageIndex(index)}
                                                        style={{
                                                            width: '100%',
                                                            cursor: 'pointer',
                                                            border: selectedImageIndex === index ? '2px solid #1677ff' : '1px solid #d9d9d9',
                                                            borderRadius: '4px'
                                                        }}
                                                    />
                                                </motion.div>
                                            ))}
                                        </Space>
                                    </Col>
                                    <Col span={20}>
                                        <Image
                                            src={product.images[selectedImageIndex]}
                                            alt={`${product.title} main image`}
                                            style={{ width: '100%', objectFit: 'contain', aspectRatio: 1 / 1 }}
                                        />
                                    </Col>
                                </Row>
                            ) : (
                                <Card>
                                    <Carousel ref={carouselRef} autoplay>
                                        {product.images.map((image, index) => (
                                            <div key={index}>
                                                <Image
                                                    src={image}
                                                    alt={`${product.title} image ${index}`}
                                                    preview={false}
                                                    style={{ width: '100%', objectFit: 'contain', aspectRatio: 1 / 1 }}
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                    <Flex justify="space-between" style={{ marginTop: '1rem' }}>
                                        <Button onClick={() => carouselRef.current.prev()} icon={<LeftOutlined />}>
                                            Back
                                        </Button>
                                        <Button onClick={() => carouselRef.current.next()}>
                                            Next <RightOutlined />
                                        </Button>
                                    </Flex>
                                </Card>
                            )}
                        </Col>

                        {/* Cột phải (Thông tin) */}
                        <Col xs={24} lg={10}>
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                
                                {/* Title, Rating, Price */}
                                <Space direction="vertical" size="small">
                                    <Title level={2} style={{ marginBottom: 0 }}>{product.title}</Title>
                                    
                                    <Flex wrap="wrap" gap="middle" align="center">
                                        <Rate disabled value={averageRating} />
                                        <Text type="secondary">
                                            ( {totalReviews === 0 ? "No reviews" : `${totalReviews} Review${totalReviews > 1 ? 's' : ''}`} )
                                        </Text>
                                        <Tag color={product.stockQuantity <= 10 ? "red" : product.stockQuantity <= 20 ? "orange" : "green"}>
                                            {product.stockQuantity <= 10 ? `Only ${product.stockQuantity} left` : product.stockQuantity <= 20 ? "Only few left" : "In Stock"}
                                        </Tag>
                                    </Flex>

                                    <Title level={3}>${product.price}</Title>
                                </Space>

                                {/* Description */}
                                <Paragraph>{product.description}</Paragraph>
                                <Divider />

                                {/* Lựa chọn và Hành động */}
                                {!loggedInUser?.isAdmin && (
                                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                        {/* Colors */}
                                        <Flex align="center" gap="middle" wrap="wrap">
                                            <Text strong>Colors: </Text>
                                            <Space wrap>
                                                {COLORS.map((color, index) => (
                                                    <Button
                                                        key={index}
                                                        shape="circle"
                                                        onClick={() => setSelectedColorIndex(index)}
                                                        style={{
                                                            backgroundColor: color,
                                                            border: color === '#F6F6F6' ? '1px solid #d9d9d9' : 'none',
                                                            width: 40,
                                                            height: 40,
                                                            transform: selectedColorIndex === index ? 'scale(1.1)' : 'scale(1)',
                                                            boxShadow: selectedColorIndex === index ? '0 0 0 2px #1677ff' : 'none'
                                                        }}
                                                    />
                                                ))}
                                            </Space>
                                        </Flex>

                                        {/* Size */}
                                        <Flex align="center" gap="middle" wrap="wrap">
                                            <Text strong>Size: </Text>
                                            <Space wrap>
                                                {SIZES.map((size) => (
                                                    <motion.div {...motionProps} key={size}>
                                                        <Button
                                                            type={selectedSize === size ? "primary" : "default"}
                                                            onClick={() => handleSizeSelect(size)}
                                                            style={{ minWidth: 50, height: 50 }}
                                                        >
                                                            {size}
                                                        </Button>
                                                    </motion.div>
                                                ))}
                                            </Space>
                                        </Flex>

                                        {/* Quantity, Add to Cart, Wishlist */}
                                        <Flex gap={screens.xs ? 8 : 16} wrap="wrap" align="center">
                                            <Flex align="center" style={{ border: '1px solid #d9d9d9', borderRadius: '8px' }}>
                                                <Button type="text" onClick={handleDecreaseQty} disabled={quantity === 1} style={{ height: 40, border: 'none' }}>-</Button>
                                                <Text style={{ margin: '0 1rem', fontSize: '1.1rem' }}>{quantity}</Text>
                                                <Button type="text" onClick={handleIncreaseQty} disabled={quantity >= 20 || quantity >= product.stockQuantity} style={{ height: 40, border: 'none' }}>+</Button>
                                            </Flex>

                                            <motion.div {...motionProps} style={{ flexGrow: 1 }}>
                                                {isProductAlreadyInCart ? (
                                                    <Button type="primary" block disabled icon={<ShoppingCartOutlined />} onClick={() => navigate("/cart")} style={{ height: 42 }}>
                                                        Đã thêm (Tới giỏ)
                                                    </Button>
                                                ) : (
                                                    <Button type="primary" block onClick={handleAddToCart} style={{ height: 42 }} icon={<ShoppingCartOutlined />}>
                                                        Thêm vào giỏ
                                                    </Button>
                                                )}
                                            </motion.div>

                                            <Tooltip title={isProductAlreadyinWishlist ? "Xóa khỏi Wishlist" : "Thêm vào Wishlist"}>
                                                <Button
                                                    icon={isProductAlreadyinWishlist ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                                                    onClick={handleWishlistToggle}
                                                    style={{ height: 42, width: 42 }}
                                                />
                                            </Tooltip>
                                        </Flex>
                                    </Space>
                                )}

                                {/* Product Perks */}
                                <Card bordered style={{ marginTop: '1.5rem' }}>
                                    <Space direction="vertical" style={{ width: '100%' }} split={<Divider style={{ margin: 0 }} />}>
                                        <Flex gap="middle" align="center">
                                            <CarOutlined style={{ fontSize: '24px' }} />
                                            <Space direction="vertical" size={0}>
                                                <Text strong>Free Delivery</Text>
                                                <Text type="secondary">Enter your postal for delivery availability</Text>
                                            </Space>
                                        </Flex>
                                        <Flex gap="middle" align="center">
                                            <UndoOutlined style={{ fontSize: '24px' }} />
                                            <Space direction="vertical" size={0}>
                                                <Text strong>Return Delivery</Text>
                                                <Text type="secondary">Free 30 Days Delivery Returns</Text>
                                            </Space>
                                        </Flex>
                                    </Space>
                                </Card>
                            </Space>
                        </Col>
                    </Row>

                    {/* Reviews */}
                    <div style={{ padding: screens.sm ? '0' : '0 1rem' }}>
                        <Reviews productId={id} averageRating={averageRating} />
                    </div>
                </Space>
            </div>
        )
    );
};