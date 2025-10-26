import { Button, Card, Flex, Typography, Grid, theme } from 'antd'
import React from 'react'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { deleteCartItemByIdAsync, updateCartItemByIdAsync } from '../CartSlice';
import { Link } from 'react-router-dom';

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;
const { useToken } = theme;

export const CartItem = ({ id, thumbnail, title, category, brand, price, quantity, stockQuantity, productId }) => {

    const dispatch = useDispatch();
    const screens = useBreakpoint();
    const { token } = useToken(); // AntD's theme token hook

    // AntD breakpoints: sm (576), md (768), lg (992), xl (1200), xxl (1600)
    // MUI breakpoints: sm (600), md (900), lg (1200)
    // is900 (MUI down(900)) -> roughly !screens.lg (less than 992)
    // is552 (MUI down(552)) -> roughly !screens.sm (less than 576)
    // is480 (MUI down(480)) -> roughly !screens.sm (less than 576)
    const isLargeScreen = !!screens.lg; // Replaces !is900
    const isSmallScreen = !screens.sm; // Replaces is552 and is480

    const handleAddQty = () => {
        const update = { _id: id, quantity: quantity + 1 }
        dispatch(updateCartItemByIdAsync(update))
    }
    
    const handleRemoveQty = () => {
        if (quantity === 1) {
            dispatch(deleteCartItemByIdAsync(id))
        }
        else {
            const update = { _id: id, quantity: quantity - 1 }
            dispatch(updateCartItemByIdAsync(update))
        }
    }

    const handleProductRemove = () => {
        dispatch(deleteCartItemByIdAsync(id))
    }

    // Dynamic styles
    const imageStyle = {
        width: isSmallScreen ? '100px' : '200px', // Simplified responsive width
        height: isSmallScreen ? '100px' : '200px', // Simplified responsive height
        aspectRatio: '1 / 1',
        objectFit: 'contain'
    };

    return (
        // Replaces Stack component={Paper}
        <Card
            bordered={isLargeScreen} // Only show border/shadow on larger screens
            style={{ backgroundColor: 'white' }}
            bodyStyle={{ padding: isLargeScreen ? 16 : 0 }} // p={is900?0:2}
        >
            {/* Replaces outer Stack */}
            <Flex justify={'space-between'} align={'center'}>

                {/* image and details */}
                {/* Replaces inner Stack (row) */}
                <Flex align={'center'} gap={16} wrap="wrap"> {/* columnGap={2} -> 16px */}
                    
                    {/* Replaces Stack for image */}
                    <Link to={`/product-details/${productId}`}>
                        <img
                            style={imageStyle}
                            src={thumbnail}
                            alt={`${title} image unavailable`}
                        />
                    </Link>

                    {/* Replaces Stack for details */}
                    <Flex vertical>
                        <Link to={`/product-details/${productId}`} style={{ textDecoration: 'none' }}>
                            <Title
                                level={5} // variant='h6'
                                style={{
                                    color: token.colorPrimary, // theme.palette.primary.main
                                    margin: 0
                                }}
                            >
                                {title}
                            </Title>
                        </Link>
                        <Text type="secondary">{brand}</Text> {/* variant='body2' color={'text.secondary'} */}
                        
                        <Text style={{ marginTop: 8 }}>Quantity</Text>
                        {/* Replaces Stack for quantity controls */}
                        <Flex align={'center'}>
                            <Button
                                icon={<MinusOutlined />}
                                onClick={handleRemoveQty}
                                size="small"
                            />
                            <Text style={{ margin: '0 12px', minWidth: '20px', textAlign: 'center' }}>
                                {quantity}
                            </Text>
                            <Button
                                icon={<PlusOutlined />}
                                onClick={handleAddQty}
                                size="small"
                            />
                        </Flex>
                    </Flex>
                </Flex>

                {/* price and remove button */}
                {/* Replaces outer Stack */}
                <Flex
                    vertical
                    justify={'space-between'}
                    align={'flex-end'}
                    gap={'1rem'}
                    style={{
                        alignSelf: isSmallScreen ? 'flex-end' : 'stretch', // 'stretch' is default for flex item
                        minHeight: isSmallScreen ? 'auto' : '100%',
                        minWidth: '100px', // <-- THAY ĐỔI: Đặt độ rộng tối thiểu
                    }}
                >
                    <Text 
                        strong 
                        style={{ 
                            fontSize: '1rem', 
                            whiteSpace: 'nowrap' // <-- THAY ĐỔI: Ngăn giá tiền bị ngắt dòng
                        }}
                    >
                        ${price}
                    </Text>
                    <Button
                        size={isSmallScreen ? "small" : "middle"} // size={is480?"small":""}
                        onClick={handleProductRemove}
                        type="primary" // variant='contained'
                        danger // AntD convention for removal
                    >
                        Remove
                    </Button>
                </Flex>
            </Flex>
        </Card>
    )
}