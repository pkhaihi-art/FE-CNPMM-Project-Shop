import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, Button, Space, Grid, Flex, Tooltip } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { addToCartAsync, selectCartItems } from '../../cart/CartSlice';

// Destructure component của AntD để code gọn hơn
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export const ProductCard = ({
    id,
    title,
    price,
    thumbnail,
    brand,
    stockQuantity,
    discountPercentage,
    handleAddRemoveFromWishlist,
    isWishlistCard,
    isAdminCard
}) => {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const screens = useBreakpoint(); // Hook responsive của AntD

    // Lấy state từ Redux (giữ nguyên)
    const wishlistItems = useSelector(selectWishlistItems);
    const loggedInUser = useSelector(selectLoggedInUser);
    const cartItems = useSelector(selectCartItems);

    // Logic kiểm tra (giữ nguyên)
    const isProductAlreadyinWishlist = wishlistItems.some((item) => (item.product && item.product._id) ? item.product._id === id : item.product === id);
    const isProductAlreadyInCart = cartItems.some((item) => (item.product && item.product._id) ? item.product._id === id : item.product === id);

    // Handler thêm vào giỏ hàng (giữ nguyên)
    const handleAddToCart = async (e) => {
        e.stopPropagation();
        const data = { user: loggedInUser?._id, product: id };
        dispatch(addToCartAsync(data));
    };

    // Handler cho Wishlist (tách ra cho rõ ràng)
    const handleWishlistClick = (e) => {
        e.stopPropagation();
        handleAddRemoveFromWishlist(e, id);
    };

    // Hàm xác định chiều rộng card dựa trên breakpoint
    const getCardWidth = () => {
        if (screens.xs) return '100%'; // Tương đương 'is408' (auto)
        if (screens.sm) return 240; // Tương đương 'is608' / 'is932'
        if (screens.md) return 300; // Tương đương 'is752' / 'is1410'
        return 340; // Kích thước mặc định
    };

    return (
        <Card
            hoverable
            style={{
                width: getCardWidth(),
                marginTop: screens.xs ? 16 : 0, // Tương đương 'mt={is408?2:0}' (8*2=16)
                cursor: 'pointer',
            }}
            // Tắt border trên màn hình nhỏ, tương tự logic 'component={is408?'':Paper}'
            bordered={!screens.xs}
            onClick={() => navigate(`/product-details/${id}`)}
            cover={
                <img
                    alt={`${title} photo unavailable`}
                    src={thumbnail}
                    style={{
                        width: '100%',
                        aspectRatio: 1 / 1,
                        objectFit: 'contain',
                        padding: '16px', // Thêm padding để ảnh không bị sát viền
                    }}
                />
            }
        >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                
                {/* Phần Title và Nút Wishlist */}
                <Flex justify="space-between" align="start">
                    <Space direction="vertical" size={0}>
                        <Title 
                            level={5} 
                            ellipsis={{ rows: 2 }} // Tự động thêm ... nếu tiêu đề quá 2 dòng
                            style={{ marginBottom: 0 }}
                        >
                            {title}
                        </Title>
                        <Text type="secondary">{brand}</Text>
                    </Space>

                    {!isAdminCard && (
                        <motion.div
                            whileHover={{ scale: 1.3, y: -5 }}
                            whileTap={{ scale: 1 }}
                            transition={{ duration: 0.4, type: "spring" }}
                        >
                            <Tooltip title={isProductAlreadyinWishlist ? "Xóa khỏi Wishlist" : "Thêm vào Wishlist"}>
                                <Button
                                    shape="circle"
                                    type="text"
                                    icon={
                                        isProductAlreadyinWishlist ? 
                                        <HeartFilled style={{ color: 'red' }} /> : 
                                        <HeartOutlined />
                                    }
                                    onClick={handleWishlistClick}
                                />
                            </Tooltip>
                        </motion.div>
                    )}
                </Flex>

                                {/* Phần Giá và Giảm giá */}
                                <Space align="center" size="middle">
                                    <Title level={4} style={{ margin: 0 }}>${price}</Title>
                                    {discountPercentage > 0 && (
                                        <span style={{
                                            background: '#ff4d4f',
                                            color: '#fff',
                                            borderRadius: 6,
                                            padding: '2px 8px',
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            marginLeft: 8
                                        }}>
                                            -{discountPercentage}%
                                        </span>
                                    )}
                                </Space>

                {/* Nút Giỏ hàng (trên dòng mới) */}
                {!isWishlistCard && !isAdminCard && (
                    isProductAlreadyInCart ? (
                        <Button disabled style={{ width: '100%' }}>
                            Đã thêm vào giỏ
                        </Button>
                    ) : (
                        <motion.div 
                            whileHover={{ scale: 1.03 }} 
                            whileTap={{ scale: 1 }}
                            style={{ width: '100%' }} 
                        >
                            <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                onClick={handleAddToCart}
                                style={{ width: '100%' }}
                            >
                                Thêm vào giỏ
                            </Button>
                        </motion.div>
                    )
                )}

                {/* Cảnh báo số lượng tồn kho */}
                {stockQuantity <= 20 && (
                    <Text type="danger" style={{ fontSize: ".9rem" }}>
                        {stockQuantity === 1 ? "Chỉ còn 1 sản phẩm" : "Chỉ còn vài sản phẩm"}
                    </Text>
                )}
            </Space>
        </Card>
    );
};