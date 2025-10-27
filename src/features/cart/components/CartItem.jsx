import { Button, Card, Flex, Typography, Grid, theme } from 'antd'
import React from 'react'
import { PlusOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { deleteCartItemByIdAsync, updateCartItemByIdAsync } from '../CartSlice';
import { Link } from 'react-router-dom';

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;
const { useToken } = theme;

export const CartItem = ({ id, thumbnail, title, category, brand, price, quantity, stockQuantity, productId, onRemoving }) => {

    const dispatch = useDispatch();
    const screens = useBreakpoint();
    const { token } = useToken();

    const isLargeScreen = !!screens.lg;
    const isSmallScreen = !screens.sm;

    const handleAddQty = () => {
        if (quantity >= stockQuantity) {
            // Không cho tăng quá số lượng trong kho
            return;
        }
        const update = { _id: id, quantity: quantity + 1 }
        dispatch(updateCartItemByIdAsync(update))
    }
    
    const handleRemoveQty = () => {
        if (quantity === 1) {
            // Gọi callback trước khi xóa
            if (onRemoving) onRemoving(id)
            // Delay dispatch để animation chạy
            setTimeout(() => {
                dispatch(deleteCartItemByIdAsync(id))
            }, 100)
        }
        else {
            const update = { _id: id, quantity: quantity - 1 }
            dispatch(updateCartItemByIdAsync(update))
        }
    }

    const handleProductRemove = () => {
        // Gọi callback trước khi xóa
        if (onRemoving) onRemoving(id)
        // Delay dispatch để animation chạy
        setTimeout(() => {
            dispatch(deleteCartItemByIdAsync(id))
        }, 100)
    }

    const imageStyle = {
        width: isSmallScreen ? '100px' : '200px',
        height: isSmallScreen ? '100px' : '200px',
        aspectRatio: '1 / 1',
        objectFit: 'contain',
        borderRadius: '8px'
    };

    return (
        <Card
            bordered={isLargeScreen}
            style={{ 
                backgroundColor: 'white',
                transition: 'box-shadow 0.3s ease'
            }}
            bodyStyle={{ padding: isLargeScreen ? 16 : 0 }}
            hoverable
        >
            <Flex justify={'space-between'} align={'center'}>

                {/* image and details */}
                <Flex align={'center'} gap={16} wrap="wrap">
                    
                    <Link to={`/product-details/${productId}`}>
                        <img
                            style={imageStyle}
                            src={thumbnail}
                            alt={`${title} image unavailable`}
                        />
                    </Link>

                    <Flex vertical gap={8}>
                        <Link to={`/product-details/${productId}`} style={{ textDecoration: 'none' }}>
                            <Title
                                level={5}
                                style={{
                                    color: token.colorPrimary,
                                    margin: 0,
                                    maxWidth: isSmallScreen ? '200px' : '300px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {title}
                            </Title>
                        </Link>
                        <Text type="secondary">{brand}</Text>
                        
                        {/* Stock warning */}
                        {stockQuantity <= 5 && (
                            <Text type="warning" style={{ fontSize: '12px' }}>
                                Chỉ còn {stockQuantity} sản phẩm
                            </Text>
                        )}

                        <Text style={{ marginTop: 4, fontSize: '13px', color: '#666' }}>Số lượng</Text>
                        
                        {/* Quantity controls */}
                        <Flex align={'center'} gap={8}>
                            <Button
                                icon={<MinusOutlined />}
                                onClick={handleRemoveQty}
                                size="small"
                                disabled={quantity <= 1}
                            />
                            <Text 
                                style={{ 
                                    margin: '0 8px', 
                                    minWidth: '30px', 
                                    textAlign: 'center',
                                    fontWeight: 500,
                                    fontSize: '15px'
                                }}
                            >
                                {quantity}
                            </Text>
                            <Button
                                icon={<PlusOutlined />}
                                onClick={handleAddQty}
                                size="small"
                                disabled={quantity >= stockQuantity}
                            />
                        </Flex>
                    </Flex>
                </Flex>

                {/* price and remove button */}
                <Flex
                    vertical
                    justify={'space-between'}
                    align={'flex-end'}
                    gap={16}
                    style={{
                        alignSelf: isSmallScreen ? 'flex-end' : 'stretch',
                        minHeight: isSmallScreen ? 'auto' : '100%',
                        minWidth: '120px',
                    }}
                >
                    {/* Price display */}
                    <Flex vertical align="flex-end" gap={4}>
                        <Text 
                            strong 
                            style={{ 
                                fontSize: '18px', 
                                whiteSpace: 'nowrap',
                                color: '#ff4d4f'
                            }}
                        >
                                {(price * quantity).toLocaleString('vi-VN')} VNĐ
                        </Text>
                        {quantity > 1 && (
                            <Text 
                                type="secondary" 
                                style={{ 
                                    fontSize: '12px',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                    {price.toLocaleString('vi-VN')} VNĐ x {quantity}
                            </Text>
                        )}
                    </Flex>

                    {/* Remove button */}
                    <Button
                        size={isSmallScreen ? "small" : "middle"}
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleProductRemove}
                    >
                        {!isSmallScreen && 'Xóa'}
                    </Button>
                </Flex>
            </Flex>
        </Card>
    )
}