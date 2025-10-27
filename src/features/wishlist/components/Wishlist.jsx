import { Button, Card, Flex, Grid, Input, Space, Typography, message } from 'antd'
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

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
            message.success(t('wishlist_add_success'))
        }
        else if (wishlistItemAddStatus === 'rejected') {
            message.error(t('wishlist_add_error'))
        }
    }, [wishlistItemAddStatus, t])

    useEffect(() => {
        if (wishlistItemDeleteStatus === 'fulfilled') {
            message.success(t('wishlist_remove_success'))
        }
        else if (wishlistItemDeleteStatus === 'rejected') {
            message.error(t('wishlist_remove_error'))
        }
    }, [wishlistItemDeleteStatus, t])

    useEffect(() => {
        if (wishlistItemUpdateStatus === 'fulfilled') {
            message.success(t('wishlist_update_success'))
        }
        else if (wishlistItemUpdateStatus === 'rejected') {
            message.error(t('wishlist_update_error'))
        }
        setEditIndex(-1)
        setEditValue("")
    }, [wishlistItemUpdateStatus, t])

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            message.success(t('cart_add_success'))
        }
        else if (cartItemAddStatus === 'rejected') {
            message.error(t('cart_add_error'))
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
    // Phần cha Stack -> Flex
        <Flex
            justify={'flex-start'}
            align={'center'}
            vertical
            style={{
                marginTop: is480 ? 24 : 40, // khoảng cách trên
                marginBottom: '14rem',
                width: '100%'
            }}
        >
            {
                wishlistFetchStatus === 'pending' ?
                    // Hiển thị animation tải dữ liệu
                    <Flex
                        style={{ width: is480 ? 'auto' : '25rem', height: 'calc(100vh - 4rem)' }}
                        justify={'center'}
                        align={'center'}
                    >
                        <Lottie animationData={loadingAnimation} />
                    </Flex>
                    :
                    // Nội dung chính
                    <Flex
                        vertical
                        gap={is480 ? 16 : 32}
                        style={{ width: is1130 ? "auto" : '70rem' }}
                    >
                        {/* Tiêu đề và nút quay lại */}
                        <Flex
                            alignSelf={'flex-start'}
                            gap={8}
                            justify={'center'}
                            align={'center'}
                        >
                            <motion.div whileHover={{ x: -5 }}>
                                <Link to={'/'}>
                                    {/* Nút quay lại */}
                                    <Button
                                        type="text"
                                        shape="circle"
                                        icon={<ArrowLeftOutlined style={{ fontSize: is480 ? 20 : 24 }} />}
                                    />
                                </Link>
                            </motion.div>
                            <Title level={4} style={{ fontWeight: 500, margin: 0 }}>Danh sách yêu thích của bạn</Title>
                        </Flex>

                        {/* Danh sách sản phẩm yêu thích */}
                        <Flex vertical>
                            {
                                !wishlistFetchStatus === 'pending' && wishlistItems?.length === 0 ? (
                                    // Trạng thái danh sách rỗng
                                    <Flex
                                        vertical
                                        style={{ minHeight: '60vh', width: is642 ? 'auto' : '40rem' }}
                                        justifySelf={'center'}
                                        alignSelf={'center'}
                                        justify={'center'}
                                        align={'center'}
                                    >
                                        <Lottie animationData={emptyWishlistAnimation} />
                                        <Title level={5} style={{ fontWeight: 300 }}>Bạn chưa có sản phẩm nào trong danh sách yêu thích</Title>
                                    </Flex>
                                ) : (
                                    // Lưới hiển thị các sản phẩm trong wishlist
                                    <Flex
                                        wrap="wrap"
                                        gap={8}
                                        justify={'center'}
                                        alignContent={'center'}
                                    >
                                        {
                                            wishlistItems.map((item, index) => (
                                                // Thẻ sản phẩm
                                                <Card
                                                    key={item._id}
                                                    bordered={!is480}
                                                    bodyStyle={{ padding: 0 }}
                                                >
                                                    {
                                                        // Trường hợp sản phẩm không tồn tại (đã bị xóa khỏi hệ thống)
                                                        !item.product || typeof item.product !== 'object' ? (
                                                            <div style={{ padding: 16 }}>
                                                                <Title level={5}>Sản phẩm không còn tồn tại</Title>
                                                                <Button type='default' onClick={() => dispatch(deleteWishlistItemByIdAsync(item._id))}>Xóa khỏi danh sách</Button>
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

                                                    {/* Phần ghi chú */}
                                                    <Flex
                                                        vertical
                                                        gap="middle"
                                                        style={{ padding: '0 16px 16px 16px' }}
                                                    >
                                                        {/* Tiêu đề ghi chú và nút chỉnh sửa */}
                                                        <Flex align={'center'}>
                                                            <Title level={5} style={{ fontWeight: 400, margin: 0 }}>Ghi chú</Title>
                                                            <Button
                                                                type="text"
                                                                shape="circle"
                                                                icon={<EditOutlined />}
                                                                onClick={() => handleEdit(index)}
                                                            />
                                                        </Flex>

                                                        {
                                                            editIndex === index ? (
                                                                // Chế độ chỉnh sửa
                                                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                                                    <TextArea
                                                                        rows={4}
                                                                        value={editValue}
                                                                        onChange={(e) => setEditValue(e.target.value)}
                                                                    />
                                                                    {/* Nhóm nút */}
                                                                    <Space style={{ alignSelf: 'flex-end', width: '100%', justifyContent: 'flex-end' }}>
                                                                        <Button onClick={() => handleNoteUpdate(item._id)} size='small' type='primary'>Cập nhật</Button>
                                                                        <Button onClick={() => setEditIndex(-1)} size='small' danger>Hủy</Button>
                                                                    </Space>
                                                                </Space>
                                                            ) : (
                                                                // Chế độ xem ghi chú
                                                                <div>
                                                                    <Paragraph
                                                                        type={item.note ? 'default' : 'secondary'}
                                                                        style={{ wordWrap: "break-word" }}
                                                                    >
                                                                        {item.note ? item.note : "Thêm ghi chú cá nhân tại đây"}
                                                                    </Paragraph>
                                                                </div>
                                                            )
                                                        }

                                                        {
                                                            // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
                                                            (item.product && item.product._id) ? (
                                                                cartItems.some((cartItem) => (cartItem.product && cartItem.product._id) ? cartItem.product._id === item.product._id : cartItem.product === item.product._id) ?
                                                                    <Link to={'/cart'}>
                                                                        <Button style={{ marginTop: 16 }} size='small' type='default'>Đã có trong giỏ hàng</Button>
                                                                    </Link>
                                                                    :
                                                                    <Button style={{ marginTop: 16 }} size='small' type='default' onClick={() => handleAddToCart(item.product._id)}>Thêm vào giỏ hàng</Button>
                                                            ) : (
                                                                <Button style={{ marginTop: 16 }} size='small' type='default' onClick={() => dispatch(deleteWishlistItemByIdAsync(item._id))}>Xóa khỏi danh sách</Button>
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