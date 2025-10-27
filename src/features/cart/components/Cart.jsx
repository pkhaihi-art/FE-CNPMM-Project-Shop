import React, { useEffect, useState } from 'react'
import { CartItem } from './CartItem'
import { Button, Flex, Typography, Grid, Divider, Tag, Empty } from 'antd'
import { resetCartItemRemoveStatus, selectCartItemRemoveStatus, selectCartItems } from '../CartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { SHIPPING, TAXES } from '../../../constants'
import { toast } from 'react-toastify'
import { ShoppingCartOutlined } from '@ant-design/icons'

const { Title, Text } = Typography;

export const Cart = ({ checkout }) => {
    const items = useSelector(selectCartItems)
    const [removingItemId, setRemovingItemId] = useState(null)
    const subtotal = items.reduce((acc, item) => ((item?.product?.price || 0) * (item?.quantity || 0)) + acc, 0)
    const totalItems = items.reduce((acc, item) => acc + (item?.quantity || 0), 0)
    const navigate = useNavigate()
    const screens = Grid.useBreakpoint();
    const cartItemRemoveStatus = useSelector(selectCartItemRemoveStatus)
    const dispatch = useDispatch()

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [])

    // Không navigate khi cart trống - giữ nguyên trang
    // useEffect(() => {
    //     if (items.length === 0 && !checkout) {
    //         const timer = setTimeout(() => {
    //             navigate("/")
    //         }, 500)
    //         return () => clearTimeout(timer)
    //     }
    // }, [items, navigate, checkout])

    useEffect(() => {
        if (cartItemRemoveStatus === 'fulfilled') {
            toast.success("Đã xóa sản phẩm khỏi giỏ hàng")
            // Reset removing state sau khi animation hoàn thành
            setTimeout(() => setRemovingItemId(null), 300)
        } else if (cartItemRemoveStatus === 'rejected') {
            toast.error("Lỗi khi xóa sản phẩm, vui lòng thử lại")
            setRemovingItemId(null)
        }
    }, [cartItemRemoveStatus])

    useEffect(() => {
        return () => {
            dispatch(resetCartItemRemoveStatus())
        }
    }, [dispatch])

    // Callback để set removing state từ CartItem
    const handleItemRemoving = (itemId) => {
        setRemovingItemId(itemId)
    }

    // Hiển thị empty state nếu cart trống
    if (items.length === 0) {
        return (
            <Flex 
                justify="center" 
                align="center" 
                vertical 
                style={{ 
                    minHeight: 'calc(100vh - 200px)',
                    padding: '2rem'
                }}
            >
                <Empty
                    image={<ShoppingCartOutlined style={{ fontSize: '80px', color: '#bfbfbf' }} />}
                    description={
                        <Flex vertical gap="small">
                            <Text style={{ fontSize: '18px', fontWeight: 500 }}>
                                Giỏ hàng của bạn đang trống
                            </Text>
                            <Text type="secondary">
                                Hãy thêm sản phẩm để tiếp tục mua sắm
                            </Text>
                        </Flex>
                    }
                >
                    <Link to="/">
                        <Button type="primary" size="large">
                            Tiếp tục mua sắm
                        </Button>
                    </Link>
                </Empty>
            </Flex>
        )
    }

    return (
        <Flex justify={'flex-start'} align={'center'} style={{ marginBottom: '5rem', width: '100%' }}>

            <Flex
                vertical
                gap={32}
                style={{
                    width: screens.lg ? '50rem' : 'auto',
                    marginTop: '3rem',
                    padding: checkout ? 0 : '0 1rem'
                }}
            >
                {/* cart items */}
                <Flex vertical gap={16}>
                    {
                        items && items.map((item) => (
                            <div
                                key={item._id}
                                style={{
                                    transition: 'all 0.3s ease-out',
                                    opacity: removingItemId === item._id ? 0 : 1,
                                    transform: removingItemId === item._id ? 'translateX(-20px)' : 'translateX(0)',
                                    maxHeight: removingItemId === item._id ? '0' : '1000px',
                                    overflow: 'hidden',
                                }}
                            >
                                <CartItem
                                    id={item._id}
                                    title={item.product?.title || ''}
                                    brand={item.product?.brand?.name || ''}
                                    category={item.product?.category?.name || ''}
                                    price={item.product?.price || 0}
                                    quantity={item.quantity}
                                    thumbnail={item.product?.thumbnail || ''}
                                    stockQuantity={item.product?.stockQuantity || 0}
                                    productId={(item.product && item.product._id) ? item.product._id : item.product}
                                    onRemoving={handleItemRemoving}
                                />
                            </div>
                        ))
                    }
                </Flex>

                {/* subtotal */}
                <Flex justify={'space-between'} align={'center'}>
                    {
                        checkout ? (
                            <Flex vertical gap={16} style={{ width: '100%' }}>

                                <Flex justify={'space-between'}>
                                    <Text>Tạm tính</Text>
                                    <Text>${subtotal.toFixed(2)}</Text>
                                </Flex>

                                <Flex justify={'space-between'}>
                                    <Text>Phí vận chuyển</Text>
                                    <Text>${SHIPPING.toFixed(2)}</Text>
                                </Flex>

                                <Flex justify={'space-between'}>
                                    <Text>Thuế</Text>
                                    <Text>${TAXES.toFixed(2)}</Text>
                                </Flex>

                                <Divider style={{ margin: '8px 0' }} />

                                <Flex justify={'space-between'}>
                                    <Text strong style={{ fontSize: '16px' }}>Tổng cộng</Text>
                                    <Text strong style={{ fontSize: '16px', color: '#ff4d4f' }}>
                                        {(subtotal + SHIPPING + TAXES).toFixed(2)} VNĐ
                                    </Text>
                                </Flex>

                            </Flex>
                        ) : (
                            <>
                                <Flex vertical>
                                    <Title level={5}>Tạm tính</Title>
                                    <Text>Tổng số sản phẩm: {totalItems}</Text>
                                    <Text type='secondary'>Phí vận chuyển và thuế sẽ được tính khi thanh toán.</Text>
                                </Flex>

                                <Flex>
                                    <Title level={5} style={{ color: '#ff4d4f', margin: 0 }}>
                                        ${subtotal.toFixed(2)}
                                    </Title>
                                </Flex>
                            </>
                        )
                    }
                </Flex>

                {/* checkout or continue shopping */}
                {
                    !checkout &&
                    <Flex vertical gap={'middle'} align="center">
                        <Link to='/checkout' style={{ width: '100%' }}>
                            <Button type='primary' block size="large">
                                Thanh toán
                            </Button>
                        </Link>
                        <Link to={'/'}>
                            <Tag style={{ cursor: "pointer", borderRadius: "8px", padding: '8px 16px', fontSize: '14px' }}>
                                hoặc tiếp tục mua sắm
                            </Tag>
                        </Link>
                    </Flex>
                }
            </Flex>
        </Flex>
    )
}