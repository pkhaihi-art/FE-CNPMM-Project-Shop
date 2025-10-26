import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderByUserIdAsync, resetOrderFetchStatus, selectOrderFetchStatus, selectOrders } from '../OrderSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { Button, Card, Flex, Typography, Grid, Image, Tag, Spin } from 'antd'
import { Link } from 'react-router-dom'
import { addToCartAsync, resetCartItemAddStatus, selectCartItemAddStatus, selectCartItems } from '../../cart/CartSlice'
import Lottie from 'lottie-react'
import { loadingAnimation, noOrdersAnimation } from '../../../assets'
import { toast } from 'react-toastify'
import { ArrowLeftOutlined } from '@ant-design/icons'

const { Title, Text } = Typography;

export const UserOrders = () => {

    const dispatch = useDispatch()
    const loggedInUser = useSelector(selectLoggedInUser)
    const orders = useSelector(selectOrders)
    const cartItems = useSelector(selectCartItems)
    const orderFetchStatus = useSelector(selectOrderFetchStatus)

    const screens = Grid.useBreakpoint(); // AntD's responsive hook

    const cartItemAddStatus = useSelector(selectCartItemAddStatus)

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [])

    useEffect(() => {
        dispatch(getOrderByUserIdAsync(loggedInUser?._id))
    }, [dispatch, loggedInUser?._id])


    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            toast.success("Product added to cart")
        } else if (cartItemAddStatus === 'rejected') {
            toast.error('Error adding product to cart, please try again later')
        }
    }, [cartItemAddStatus])

    useEffect(() => {
        if (orderFetchStatus === 'rejected') {
            toast.error("Error fetching orders, please try again later")
        }
    }, [orderFetchStatus])

    useEffect(() => {
        return () => {
            dispatch(resetOrderFetchStatus())
            dispatch(resetCartItemAddStatus())
        }
    }, [dispatch])


    const handleAddToCart = (productOrId) => {
        // productOrId can be an object { _id } or a plain id string
        const productId = (productOrId && productOrId._id) ? productOrId._id : productOrId;
        if (!productId) return;
        const item = { user: loggedInUser._id, product: productId, quantity: 1 }
        dispatch(addToCartAsync(item))
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'gold';
            case 'shipped':
                return 'blue';
            case 'delivered':
                return 'green';
            case 'cancelled':
                return 'red';
            default:
                return 'default';
        }
    }


    if (orderFetchStatus === 'pending') {
        return (
            <Flex style={{ width: '100vw', height: 'calc(100vh - 4rem)' }} justify={'center'} align={'center'}>
                {/* You can use AntD's Spin or your Lottie animation */}
                {/* <Spin size="large" /> */}
                <div style={{ width: screens.xs ? 'auto' : '25rem' }}>
                    <Lottie animationData={loadingAnimation} />
                </div>
            </Flex>
        )
    }

    return (
        <Flex justify={'center'} align={'center'}>
            <Flex
                vertical
                style={{
                    width: screens.xl ? "60rem" : "auto", // is1200
                    padding: screens.xs ? 16 : 32, // is480
                    marginBottom: '5rem'
                }}
            >

                {/* heading and navigation */}
                <Flex gap={16} align="center">
                    {
                        !screens.xs && ( // !is480
                            <Link to={"/"}>
                                <Button type="text" shape="circle" icon={<ArrowLeftOutlined />} size='large' />
                            </Link>
                        )
                    }

                    <Flex vertical gap={8} >
                        <Title level={4} style={{ margin: 0 }}>Order history</Title>
                        <Text type="secondary">Check the status of recent orders, manage returns, and discover similar products.</Text>
                    </Flex>
                </Flex>

                {/* orders */}
                <Flex vertical style={{ marginTop: 40 }} gap={40}>

                    {/* orders mapping */}
                    {
                        orders && orders.map((order) => (
                            <Card
                                key={order._id}
                                // Use bordered={false} or style to remove border/shadow on mobile
                                style={{ borderWidth: screens.xs ? 0 : 1, boxShadow: screens.xs ? 'none' : '' }}
                                bodyStyle={{ padding: screens.xs ? 0 : 24 }}
                            >
                                <Flex vertical gap={16}>

                                    {/* upper */}
                                    <Flex justify={'space-between'} wrap={'wrap'} gap={'1rem'}>
                                        <Flex gap={32} wrap={'wrap'}>
                                            <Flex vertical>
                                                <Text>Order Number</Text>
                                                <Text type={'secondary'}>{order._id}</Text>
                                            </Flex>

                                            <Flex vertical>
                                                <Text>Date Placed</Text>
                                                <Text type={'secondary'}>{new Date(order.createdAt).toDateString()}</Text>
                                            </Flex>

                                            <Flex vertical>
                                                <Text>Total Amount</Text>
                                                <Text strong>${order.total}</Text>
                                            </Flex>
                                        </Flex>

                                        <Flex>
                                            <Text>Item: {order.item.length}</Text>
                                        </Flex>
                                    </Flex>

                                    {/* middle - products */}
                                    <Flex vertical gap={16}>
                                        {
                                            order.item.map((product) => (
                                                <Flex
                                                    key={product.product?._id || product.product}
                                                    style={{ marginTop: 16 }}
                                                    gap={16}
                                                    wrap={screens.md ? "wrap" : "nowrap"} // is768
                                                >
                                                    <Image
                                                        width={120} // Give a fixed width
                                                        src={(product.product && product.product.images && product.product.images[0]) ? product.product.images[0] : ''}
                                                        alt={(product.product && product.product.title) ? product.product.title : 'Product image'}
                                                        style={{
                                                            objectFit: "contain",
                                                            aspectRatio: '1/1',
                                                            border: '1px solid #f0f0f0',
                                                            borderRadius: 8
                                                        }}
                                                    />

                                                    <Flex vertical style={{ width: '100%', flex: 1 }} gap={8}>
                                                        <Flex justify={'space-between'}>
                                                            <Flex vertical>
                                                                <Text strong>{product.product.title}</Text>
                                                                <Text type={'secondary'}>{product.product.brand.name}</Text>
                                                                <Text type={'secondary'}>Qty: {product.quantity}</Text>
                                                            </Flex>
                                                            <Text strong>${product.product.price}</Text>
                                                        </Flex>

                                                        <Text type="secondary">{product.product.description}</Text>

                                                        <Flex
                                                            style={{ marginTop: 16 }}
                                                            align="center"
                                                            justify={screens.xs ? "flex-start" : 'flex-end'} // is480
                                                            gap={8}
                                                        >
                                                            <Link to={`/product-details/${product.product?._id || product.product}`}>
                                                                <Button size='small'>View Product</Button>
                                                            </Link>
                                                            {
                                                                cartItems.some((cartItem) => (cartItem.product && cartItem.product._id) ? cartItem.product._id === (product.product?._id || product.product) : cartItem.product === (product.product?._id || product.product)) ?
                                                                    <Link to={"/cart"}>
                                                                        <Button size='small' type='primary'>Already in Cart</Button>
                                                                    </Link>
                                                                    : <Button size='small' type='primary' onClick={() => handleAddToCart(product.product)}>Buy Again</Button>
                                                            }
                                                        </Flex>
                                                    </Flex>
                                                </Flex>
                                            ))
                                        }
                                    </Flex>

                                    {/* lower */}
                                    <Flex style={{ marginTop: 16 }} justify={'space-between'}>
                                        <Text>Status : <Tag color={getStatusColor(order.status)}>{order.status}</Tag></Text>
                                    </Flex>
                                </Flex>
                            </Card>
                        ))
                    }

                    {/* no orders animation */}
                    {
                        !orders.length && (
                            <Flex
                                vertical
                                align={'center'}
                                gap={16}
                                style={{ marginTop: screens.xs ? '2rem' : 0, marginBottom: '7rem' }}
                            >
                                <div style={{ width: screens.sm ? '30rem' : 'auto' }}>
                                    <Lottie animationData={noOrdersAnimation} />
                                </div>
                                <Title level={5} style={{ textAlign: 'center' }}>
                                    oh! Looks like you haven't been shopping lately
                                </Title>
                            </Flex>
                        )
                    }
                </Flex>
            </Flex>
        </Flex>
    )
}