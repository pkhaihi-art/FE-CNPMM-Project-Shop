import { Button, Card, Flex, Grid, Input, Space, Typography, message } from 'antd'
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux'
import {
    createWishlistItemAsync,
    deleteWishlistItemByIdAsync,
    resetWishlistFetchStatus,
    resetWishlistItemAddStatus,
    resetWishlistItemDeleteStatus,
    resetWishlistItemUpdateStatus,
    selectWishlistFetchStatus,
    selectWishlistItemAddStatus,
    selectWishlistItemDeleteStatus,
    selectWishlistItemUpdateStatus,
    selectWishlistItems,
    updateWishlistItemByIdAsync
} from '../WishlistSlice'
import { ProductCard } from '../../products/components/ProductCard'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import { toast } from 'react-toastify'; // Thay thế bằng message của AntD
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { emptyWishlistAnimation, loadingAnimation } from '../../../assets';
import Lottie from 'lottie-react'
import { useForm } from "react-hook-form"
import {
    addToCartAsync,
    resetCartItemAddStatus,
    selectCartItemAddStatus,
    selectCartItems
} from '../../cart/CartSlice'
import { motion } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;
const { TextArea } = Input;

export const Wishlist = () => {

    const dispatch = useDispatch()
    const wishlistItems = useSelector(selectWishlistItems)
    const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus)
    const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus)
    const wishlistItemUpdateStatus = useSelector(selectWishlistItemUpdateStatus)
    const loggedInUser = useSelector(selectLoggedInUser)
    const cartItems = useSelector(selectCartItems)
    const cartItemAddStatus = useSelector(selectCartItemAddStatus)
    const wishlistFetchStatus = useSelector(selectWishlistFetchStatus)

    const [editIndex, setEditIndex] = useState(-1)
    const [editValue, setEditValue] = useState('')
    // useForm import is kept as in original, though not fully wired
    const { register, handleSubmit, watch, formState: { errors } } = useForm()

    const screens = useBreakpoint();
    // AntD breakpoints: sm (576), md (768), lg (992), xl (1200)
    // is1130 (MUI down 1130) -> !screens.xl (xl starts at 1200)
    // is642 (MUI down 642) -> !screens.md (md starts at 768)
    // is480 (MUI down 480) -> !screens.sm (sm starts at 576)
    const is1130 = !screens.xl;
    const is642 = !screens.md;
    const is480 = !screens.sm;

    const handleAddRemoveFromWishlist = (e, productId) => {
        if (e?.target?.checked) {
            const data = { user: loggedInUser?._id, product: productId }
            dispatch(createWishlistItemAsync(data))
        }
        else if (!e?.target?.checked) {
            const index = wishlistItems.findIndex((item) => (item.product && item.product._id) ? item.product._id === productId : item.product === productId)
            if (index !== -1) {
                dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
            }
        }
    }

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [])

    // --- useEffects handling messages (thay thế toast) ---
    useEffect(() => {
        if (wishlistItemAddStatus === 'fulfilled') {
            message.success("Product added to wishlist")
        }
        else if (wishlistItemAddStatus === 'rejected') {
            message.error("Error adding product to wishlist, please try again later")
        }
    }, [wishlistItemAddStatus])

    useEffect(() => {
        if (wishlistItemDeleteStatus === 'fulfilled') {
            message.success("Product removed from wishlist")
        }
        else if (wishlistItemDeleteStatus === 'rejected') {
            message.error("Error removing product from wishlist, please try again later")
        }
    }, [wishlistItemDeleteStatus])

    useEffect(() => {
        if (wishlistItemUpdateStatus === 'fulfilled') {
            message.success("Wishlist item updated")
        }
        else if (wishlistItemUpdateStatus === 'rejected') {
            message.error("Error updating wishlist item")
        }
        setEditIndex(-1)
        setEditValue("")
    }, [wishlistItemUpdateStatus])

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            message.success("Product added to cart")
        }
        else if (cartItemAddStatus === 'rejected') {
            message.error('Error adding product to cart, please try again later')
        }
    }, [cartItemAddStatus])

    useEffect(() => {
        if (wishlistFetchStatus === 'rejected') {
            message.error("Error fetching wishlist, please try again later")
        }
    }, [wishlistFetchStatus])

    // Cleanup useEffect
    useEffect(() => {
        return () => {
            dispatch(resetWishlistFetchStatus())
            dispatch(resetCartItemAddStatus())
            dispatch(resetWishlistItemUpdateStatus())
            dispatch(resetWishlistItemDeleteStatus())
            dispatch(resetWishlistItemAddStatus())
        }
    }, [dispatch])

    const handleNoteUpdate = (wishlistItemId) => {
        const update = { _id: wishlistItemId, note: editValue }
        dispatch(updateWishlistItemByIdAsync(update))
    }

    const handleEdit = (index) => {
        setEditValue(wishlistItems[index].note)
        setEditIndex(index)
    }

    const handleAddToCart = (productId) => {
        const data = { user: loggedInUser?._id, product: productId }
        dispatch(addToCartAsync(data))
    }


    return (
        // parent Stack -> Flex
        <Flex
            justify={'flex-start'}
            align={'center'}
            vertical
            style={{
                marginTop: is480 ? 24 : 40, // mt={is480?3:5}
                marginBottom: '14rem',
                width: '100%'
            }}
        >
            {
                wishlistFetchStatus === 'pending' ?
                    // Loading Animation Stack -> Flex
                    <Flex
                        style={{ width: is480 ? 'auto' : '25rem', height: 'calc(100vh - 4rem)' }}
                        justify={'center'}
                        align={'center'}
                    >
                        <Lottie animationData={loadingAnimation} />
                    </Flex>
                    :
                    // Main Content Stack -> Flex
                    <Flex
                        vertical
                        gap={is480 ? 16 : 32} // rowGap={is480?2:4}
                        style={{ width: is1130 ? "auto" : '70rem' }}
                    >
                        {/* heading area and back button Stack -> Flex */}
                        <Flex
                            alignSelf={'flex-start'}
                            gap={8} // columnGap={1}
                            justify={'center'}
                            align={'center'}
                        >
                            <motion.div whileHover={{ x: -5 }}>
                                <Link to={'/'}>
                                    {/* IconButton -> Button */}
                                    <Button
                                        type="text"
                                        shape="circle"
                                        icon={<ArrowLeftOutlined style={{ fontSize: is480 ? 20 : 24 }} />} // fontSize large
                                    />
                                </Link>
                            </motion.div>
                            <Title level={4} style={{ fontWeight: 500, margin: 0 }}>Your wishlist</Title>
                        </Flex>

                        {/* product grid Stack -> Flex */}
                        <Flex vertical>
                            {
                                !wishlistFetchStatus === 'pending' && wishlistItems?.length === 0 ? (
                                    // empty wishlist animation Stack -> Flex
                                    <Flex
                                        vertical
                                        style={{ minHeight: '60vh', width: is642 ? 'auto' : '40rem' }}
                                        justifySelf={'center'}
                                        alignSelf={'center'}
                                        justify={'center'}
                                        align={'center'}
                                    >
                                        <Lottie animationData={emptyWishlistAnimation} />
                                        <Title level={5} style={{ fontWeight: 300 }}>You have no items in your wishlist</Title>
                                    </Flex>
                                ) : (
                                    // wishlist grid: Grid container -> Flex wrap
                                    <Flex
                                        wrap="wrap"
                                        gap={8} // gap={1} -> 8px
                                        justify={'center'}
                                        alignContent={'center'}
                                    >
                                        {
                                            wishlistItems.map((item, index) => (
                                                // Stack component={Paper} -> Card
                                                <Card
                                                    key={item._id}
                                                    bordered={!is480} // elevation={1} when not is480
                                                    bodyStyle={{ padding: 0 }} // Remove default padding
                                                >
                                                    {
                                                        // Guard against cases where backend returns wishlist item with product as ID only
                                                        !item.product || typeof item.product !== 'object' ? (
                                                            <div style={{ padding: 16 }}>
                                                                <Title level={5}>Product unavailable</Title>
                                                                <Button type='default' onClick={() => dispatch(deleteWishlistItemByIdAsync(item._id))}>Remove</Button>
                                                            </div>
                                                        ) : (
                                                            <ProductCard
                                                                item
                                                                key={item._id}
                                                                brand={item.product?.brand?.name}
                                                                id={item.product?._id}
                                                                price={item.product?.price}
                                                                stockQuantity={item.product?.stockQuantity}
                                                                thumbnail={item.product?.thumbnail}
                                                                title={item.product?.title}
                                                                handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                                                                isWishlistCard={true}
                                                            />
                                                        )
                                                    }

                                                    {/* Note section Stack -> Flex */}
                                                    <Flex
                                                        vertical
                                                        gap="middle" // Controls spacing
                                                        style={{ padding: '0 16px 16px 16px' }} // paddingLeft/Right/Bottom={2}
                                                    >
                                                        {/* note heading and icon Stack -> Flex */}
                                                        <Flex align={'center'}>
                                                            <Title level={5} style={{ fontWeight: 400, margin: 0 }}>Note</Title>
                                                            <Button
                                                                type="text"
                                                                shape="circle"
                                                                icon={<EditOutlined />}
                                                                onClick={() => handleEdit(index)}
                                                            />
                                                        </Flex>

                                                        {
                                                            editIndex === index ? (
                                                                // Edit mode Stack -> Space
                                                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                                                    {/* TextField -> Input.TextArea */}
                                                                    <TextArea
                                                                        rows={4}
                                                                        value={editValue}
                                                                        onChange={(e) => setEditValue(e.target.value)}
                                                                    />
                                                                    {/* Button group Stack -> Space */}
                                                                    <Space style={{ alignSelf: 'flex-end', width: '100%', justifyContent: 'flex-end' }}>
                                                                        <Button onClick={() => handleNoteUpdate(item._id)} size='small' type='primary'>Update</Button>
                                                                        <Button onClick={() => setEditIndex(-1)} size='small' danger>Cancel</Button>
                                                                    </Space>
                                                                </Space>
                                                            ) : (
                                                                // View mode Box -> div
                                                                <div>
                                                                    {/* Typography -> Typography.Paragraph */}
                                                                    <Paragraph
                                                                        type={item.note ? 'default' : 'secondary'} // color=GrayText
                                                                        style={{ wordWrap: "break-word" }}
                                                                    >
                                                                        {item.note ? item.note : "Add a custom note here"}
                                                                    </Paragraph>
                                                                </div>
                                                            )
                                                        }

                                                        {
                                                            // safe checks for cart membership and add-to-cart action
                                                            (item.product && item.product._id) ? (
                                                                cartItems.some((cartItem) => (cartItem.product && cartItem.product._id) ? cartItem.product._id === item.product._id : cartItem.product === item.product._id) ?
                                                                    <Link to={'/cart'}>
                                                                        <Button style={{ marginTop: 16 }} size='small' type='default'>Already in cart</Button>
                                                                    </Link>
                                                                    :
                                                                    <Button style={{ marginTop: 16 }} size='small' type='default' onClick={() => handleAddToCart(item.product._id)}>Add To Cart</Button>
                                                            ) : (
                                                                <Button style={{ marginTop: 16 }} size='small' type='default' onClick={() => dispatch(deleteWishlistItemByIdAsync(item._id))}>Remove</Button>
                                                            )
                                                        }

                                                    </Flex>
                                                </Card>
                                            ))
                                        }
                                    </Flex>
                                )
                            }
                        </Flex>
                    </Flex>
            }
        </Flex>
    )
}