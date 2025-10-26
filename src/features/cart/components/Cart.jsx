import React, { useEffect } from 'react'
import { CartItem } from './CartItem'
import { Button, Flex, Typography, Grid, Divider, Tag } from 'antd'
import { resetCartItemRemoveStatus, selectCartItemRemoveStatus, selectCartItems } from '../CartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { SHIPPING, TAXES } from '../../../constants'
import { toast } from 'react-toastify'

const { Title, Text } = Typography;

export const Cart = ({ checkout }) => {
    const items = useSelector(selectCartItems)
    const subtotal = items.reduce((acc, item) => item.product.price * item.quantity + acc, 0)
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
    const navigate = useNavigate()
    const screens = Grid.useBreakpoint(); // AntD's responsive hook
    const cartItemRemoveStatus = useSelector(selectCartItemRemoveStatus)
    const dispatch = useDispatch()

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [])

    useEffect(() => {
        if (items.length === 0) {
            navigate("/")
        }
    }, [items, navigate])

    useEffect(() => {
        if (cartItemRemoveStatus === 'fulfilled') {
            toast.success("Product removed from cart")
        } else if (cartItemRemoveStatus === 'rejected') {
            toast.error("Error removing product from cart, please try again later")
        }
    }, [cartItemRemoveStatus])

    useEffect(() => {
        return () => {
            dispatch(resetCartItemRemoveStatus())
        }
    }, [dispatch])

    return (
        <Flex justify={'flex-start'} align={'center'} style={{ marginBottom: '5rem', width: '100%' }}>

            <Flex
                vertical
                gap={32}
                style={{
                    width: screens.lg ? '50rem' : 'auto', // Replaces is900
                    marginTop: '3rem',
                    padding: checkout ? 0 : '0 1rem'
                }}
            >
                {/* cart items */}
                <Flex vertical gap={16}>
                    {
                        items && items.map((item) => (
                            <CartItem
                                key={item._id}
                                id={item._id}
                                title={item.product?.title || ''}
                                brand={item.product?.brand?.name || ''}
                                category={item.product?.category?.name || ''}
                                price={item.product?.price || 0}
                                quantity={item.quantity}
                                thumbnail={item.product?.thumbnail || ''}
                                stockQuantity={item.product?.stockQuantity || 0}
                                productId={(item.product && item.product._id) ? item.product._id : item.product}
                            />
                        ))
                    }
                </Flex>

                {/* subtotal */}
                <Flex justify={'space-between'} align={'center'}>
                    {
                        checkout ? (
                            <Flex vertical gap={16} style={{ width: '100%' }}>

                                <Flex justify={'space-between'}>
                                    <Text>Subtotal</Text>
                                    <Text>${subtotal}</Text>
                                </Flex>

                                <Flex justify={'space-between'}>
                                    <Text>Shipping</Text>
                                    <Text>${SHIPPING}</Text>
                                </Flex>

                                <Flex justify={'space-between'}>
                                    <Text>Taxes</Text>
                                    <Text>${TAXES}</Text>
                                </Flex>

                                <Divider style={{ margin: '8px 0' }} />

                                <Flex justify={'space-between'}>
                                    <Text strong>Total</Text>
                                    <Text strong>${subtotal + SHIPPING + TAXES}</Text>
                                </Flex>

                            </Flex>
                        ) : (
                            <>
                                <Flex vertical>
                                    <Title level={5}>Subtotal</Title>
                                    <Text>Total items in cart {totalItems}</Text>
                                    <Text type='secondary'>Shipping and taxes will be calculated at checkout.</Text>
                                </Flex>

                                <Flex>
                                    <Title level={5}>${subtotal}</Title>
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
                            <Button type='primary' block>Checkout</Button>
                        </Link>
                        <Link to={'/'}>
                            <Tag style={{ cursor: "pointer", borderRadius: "8px", padding: '5px 10px' }}>
                                or continue shopping
                            </Tag>
                        </Link>
                    </Flex>
                }
            </Flex>
        </Flex>
    )
}