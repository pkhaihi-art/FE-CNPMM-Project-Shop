import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, Button, Space, Grid, Flex, Tooltip, message } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, fetchWishlistByUserIdAsync } from '../../wishlist/WishlistSlice';

import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { addToCartAsync, selectCartItems, selectCartItemAddStatus, selectCartAddingProductIds, selectCartAddedProductIds } from '../../cart/CartSlice';

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

    // Lấy state từ Redux
    const wishlistItems = useSelector(selectWishlistItems);
    const loggedInUser = useSelector(selectLoggedInUser);
    const cartItems = useSelector(selectCartItems);

    // Selectors cho trạng thái wishlist và cart
    const wishlistAddStatus = useSelector(selectWishlistItemAddStatus);
    const wishlistDeleteStatus = useSelector(selectWishlistItemDeleteStatus);
    const cartAddStatus = useSelector(selectCartItemAddStatus);

    // Trạng thái loading
    const isWishlistLoading = wishlistAddStatus === 'pending' || wishlistDeleteStatus === 'pending';
    const isCartLoading = cartAddStatus === 'pending';
    const addingProductIds = useSelector(selectCartAddingProductIds);
    const addedProductIds = useSelector(selectCartAddedProductIds);
    const isAddedFromStore = (addingProductIds || []).includes(id) || (addedProductIds || []).includes(id);

    // Xử lý cập nhật sau khi thêm/xóa khỏi wishlist
    React.useEffect(() => {
        if (wishlistAddStatus === 'fulfilled' || wishlistDeleteStatus === 'fulfilled') {
            // Refresh wishlist data
            dispatch(fetchWishlistByUserIdAsync());
        }
    }, [wishlistAddStatus, wishlistDeleteStatus, dispatch]);


        // Logic kiểm tra cải tiến với xử lý null/undefined
        const isProductAlreadyinWishlist = wishlistItems.some((item) => {
            if (!item || !item.product) return false;
        
            // Kiểm tra nếu item.product là object hoặc string
            if (typeof item.product === 'object') {
                return item.product?._id === id;
            }
            return item.product === id;
        });

        const isProductAlreadyInCart = cartItems.some((item) => {
            if (!item || !item.product) return false;
        
            // Kiểm tra nếu item.product là object hoặc string
            if (typeof item.product === 'object') {
                return item.product?._id === id;
            }
            return item.product === id;
        });

        // No-op helpers removed; direct checks used where needed
    // Effect để refresh wishlist sau khi thêm/xóa
    React.useEffect(() => {
        if ((wishlistAddStatus === 'fulfilled' || wishlistDeleteStatus === 'fulfilled') && loggedInUser?._id) {
            dispatch(fetchWishlistByUserIdAsync(loggedInUser._id));
            message.success(wishlistAddStatus === 'fulfilled' ? 'Đã thêm vào danh sách yêu thích' : 'Đã xóa khỏi danh sách yêu thích');
        }
    }, [wishlistAddStatus, wishlistDeleteStatus, loggedInUser, dispatch]);

    // Handler thêm vào giỏ hàng với xử lý lỗi
    const handleAddToCart = async (e) => {
        e.stopPropagation();

        // Kiểm tra id sản phẩm
        if (!id) {
            message.error("Không tìm thấy thông tin sản phẩm");
            return;
        }

        if (!loggedInUser) {
            message.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
            return;
        }

        // Nếu đã thêm local hoặc server-side thì không cho thêm nữa
        const alreadyInCart = cartItems.some(item => {
            if (!item || !item.product) return false;
            return (typeof item.product === 'object') ? item.product._id === id : item.product === id;
        });
        if (alreadyInCart || isAddedFromStore) {
            message.info("Sản phẩm đã có trong giỏ hàng");
            return;
        }

        try {
            await dispatch(addToCartAsync({ user: loggedInUser._id, product: id })).unwrap();
            message.success("Đã thêm vào giỏ hàng");
        } catch (error) {
            console.error('Add to cart error:', error);
            message.error(error?.message || "Có lỗi xảy ra, vui lòng thử lại sau");
        }
    };

    // Handler cho Wishlist với xử lý lỗi
    const handleWishlistClick = (e) => {
        e.stopPropagation();
           // Kiểm tra id sản phẩm
           if (!id) {
               message.error("Không tìm thấy thông tin sản phẩm");
               return;
           }
        try {
            if (!loggedInUser) {
                message.error("Vui lòng đăng nhập để thêm vào danh sách yêu thích");
                return;
            }
            handleAddRemoveFromWishlist(e, id);
        } catch (error) {
               // Kiểm tra sản phẩm trong wishlist
               const existingWishlistItem = wishlistItems.find(item => {
                   if (!item || !item.product) return false;
                   return (typeof item.product === 'object') 
                       ? item.product._id === id 
                       : item.product === id;
               });

               if (existingWishlistItem && !existingWishlistItem.product) {
                   message.error("Có lỗi với sản phẩm trong danh sách yêu thích");
                   return;
               }
            console.error('Wishlist action error:', error);
            message.error("Có lỗi xảy ra, vui lòng thử lại sau");
        }
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
                    alt={title}
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
                                    loading={isWishlistLoading}
                                    disabled={isWishlistLoading}
                                />
                            </Tooltip>
                        </motion.div>
                    )}
                </Flex>

                                {/* Phần Giá và Giảm giá */}
                                <Space align="center" size="middle">
                                 <Title level={4} style={{ margin: 0 }}>{price.toLocaleString('vi-VN')} VNĐ</Title>
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
                    (isProductAlreadyInCart || isAddedFromStore) ? (
                        <Button disabled style={{ width: '100%', background: '#f0f0f0', color: '#8c8c8c' }}>
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
                                loading={isCartLoading}
                                disabled={isCartLoading || isAddedFromStore}
                            >
                                {isCartLoading ? 'Đang thêm...' : (isAddedFromStore ? 'Đã thêm' : 'Thêm vào giỏ')}
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