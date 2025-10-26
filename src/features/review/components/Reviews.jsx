import { Button, Progress, Rate, Flex, Input, Typography, Grid, Form, Space } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
    createReviewAsync, 
    resetReviewAddStatus, 
    resetReviewDeleteStatus, 
    resetReviewUpdateStatus, 
    selectReviewAddStatus, 
    selectReviewDeleteStatus, 
    selectReviewStatus, 
    selectReviewUpdateStatus, 
    selectReviews 
} from '../ReviewSlice'
import { ReviewItem } from './ReviewItem' // Giả định đây là component Antd đã chuyển đổi
import { useForm } from 'react-hook-form'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { toast } from 'react-toastify'
import { EditOutlined } from '@ant-design/icons';
import { MotionConfig, motion } from 'framer-motion'

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

export const Reviews = ({ productId, averageRating }) => {

    const dispatch = useDispatch();
    const reviews = useSelector(selectReviews);
    const [value, setValue] = useState(1);
    const { register, handleSubmit, reset, setValue: setFormValue, formState: { errors } } = useForm();
    const loggedInUser = useSelector(selectLoggedInUser);
    const reviewStatus = useSelector(selectReviewStatus);
    
    // Các selector status
    const reviewAddStatus = useSelector(selectReviewAddStatus);
    const reviewDeleteStatus = useSelector(selectReviewDeleteStatus);
    const reviewUpdateStatus = useSelector(selectReviewUpdateStatus);

    const [writeReview, setWriteReview] = useState(false);
    
    // Tương đương với useMediaQuery
    const screens = useBreakpoint();
    const isMobile = !screens.sm; // < 576px (tương đương is480)
    const isTablet = !screens.lg; // < 992px (tương đương is840)

    // Các useEffect xử lý toast (giữ nguyên vì react-toastify là thư viện độc lập)
    useEffect(() => {
        if (reviewAddStatus === 'fulfilled') {
            toast.success("Review added");
            reset();
            setValue(1);
        } else if (reviewAddStatus === 'rejected') {
            toast.error("Error posting review, please try again later");
        }
    }, [reviewAddStatus, reset]);

    useEffect(() => {
        if (reviewDeleteStatus === 'fulfilled') {
            toast.success("Review deleted");
        } else if (reviewDeleteStatus === 'rejected') {
            toast.error("Error deleting review, please try again later");
        }
    }, [reviewDeleteStatus]);

    useEffect(() => {
        if (reviewUpdateStatus === 'fulfilled') {
            toast.success("Review updated");
        } else if (reviewUpdateStatus === 'rejected') {
            toast.error("Error updating review, please try again later");
        }
    }, [reviewUpdateStatus]);

    useEffect(() => {
        return () => {
            dispatch(resetReviewAddStatus());
            dispatch(resetReviewDeleteStatus());
            dispatch(resetReviewUpdateStatus());
        }
    }, [dispatch]);

    // Logic tính toán rating (giữ nguyên)
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
        ratingCounts[review.rating] = ratingCounts[review.rating] + 1;
    });

    // Xử lý thêm review
    const handleAddReview = (data) => {
        const review = { ...data, rating: value, user: loggedInUser._id, product: productId };
        dispatch(createReviewAsync(review));
        setWriteReview(false);
    };

    // Xử lý hủy form
    const handleCancelWrite = () => {
        setWriteReview(false);
        reset(); // Reset form (react-hook-form)
        setValue(1); // Reset rating
    }

    // Tính toán style width cho component cha
    const containerWidth = isMobile ? "90vw" : isTablet ? "25rem" : "40rem";

    return (
        // Stack -> Flex (vertical)
        <Flex vertical gap={40} align="flex-start" style={{ width: containerWidth }}>

            {/* Phần tóm tắt review */}
            <Flex vertical style={{width: '100%'}}>
                <Title level={4} style={{ fontWeight: 400, marginBottom: '0.5em' }}>Reviews</Title>
                {
                    reviews?.length ? (
                        <Flex vertical gap={24}>
                            {/* Điểm trung bình */}
                            <Flex vertical gap={8}>
                                <Title level={2} style={{ fontWeight: 800, margin: 0 }}>{averageRating}.0</Title>
                                {/* Rating -> Rate */}
                                <Rate disabled allowHalf value={averageRating} />
                                <Text type="secondary" style={{ fontSize: '1.1rem' }}>
                                    Based on {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
                                </Text>
                            </Flex>

                            {/* Thanh progress */}
                            <Flex vertical gap={16}>
                                {
                                    [5, 4, 3, 2, 1].map((number) => {
                                        const percent = (ratingCounts[number] / reviews.length) * 100;
                                        return (
                                            // Stack (row) -> Flex
                                            <Flex key={number} align="center" gap={8} style={{ width: '100%' }}>
                                                <Text style={{ whiteSpace: "nowrap" }}>{number} star</Text>
                                                {/* LinearProgress -> Progress */}
                                                <Progress
                                                    percent={percent}
                                                    showInfo={false}
                                                    style={{ flex: 1 }}
                                                    strokeWidth={10} // Tương đương height: "1rem"
                                                    strokeColor={"#1976d2"} // Màu primary mặc định của MUI
                                                />
                                                <Text style={{minWidth: 40, textAlign: 'right'}}>{parseInt(percent)}%</Text>
                                            </Flex>
                                        );
                                    })
                                }
                            </Flex>
                        </Flex>
                    ) : (
                        <Text type="secondary" style={{ fontSize: '1.1rem' }}>
                            {loggedInUser?.isAdmin ? "There are no reviews currently" : "Be the one to post review first"}
                        </Text>
                    )
                }
            </Flex>

            {/* Danh sách review */}
            <Flex vertical gap={16} style={{ width: '100%' }}>
                {reviews?.map((review) => (
                    <ReviewItem 
                        key={review._id} 
                        id={review._id} 
                        userid={review.user._id} 
                        comment={review.comment} 
                        createdAt={review.createdAt} 
                        rating={review.rating} 
                        username={review.user.name} 
                    />
                ))}
            </Flex>

            {/* Form thêm review */}
            {
                writeReview ? (
                    // Stack (form) -> Form (Antd) + Flex
                    <Form layout="vertical" onFinish={handleSubmit(handleAddReview)} style={{ width: '100%' }}>
                        <Flex vertical gap={24}>
                            {/* TextField -> Form.Item + Input.TextArea */}
                            <Form.Item
                                validateStatus={errors.comment ? 'error' : ''}
                                help={errors.comment ? "Comment is required" : null}
                                style={{ marginTop: 16, width: isTablet ? '100%' : '40rem', marginBottom: 0 }}
                            >
                                <Input.TextArea
                                    {...register("comment", { required: true })}
                                    rows={6}
                                    placeholder='Write a review...'
                                />
                            </Form.Item>

                            {/* Rating */}
                            <Flex vertical gap={4}>
                                <Text>How much did you like the product?</Text>
                                <motion.div style={{ width: "fit-content" }} whileHover={{ scale: 1.050, x: 2 }} whileTap={{ scale: 1 }}>
                                    {/* Rating -> Rate */}
                                    <Rate
                                        style={{ fontSize: 24 }} // Tương đương size="large"
                                        value={value}
                                        onChange={setValue} // Antd Rate truyền value trực tiếp
                                    />
                                </motion.div>
                            </Flex>

                            {/* Nút bấm */}
                            <Flex justify="flex-end" gap={8}>
                                <MotionConfig whileTap={{ scale: 1 }} whileHover={{ scale: 1.050 }}>
                                    <motion.div>
                                        {/* Button -> Button (danger) */}
                                        <Button
                                            danger
                                            onClick={handleCancelWrite}
                                            size={isMobile ? "small" : "middle"}
                                            style={{ textTransform: "none", fontSize: isMobile ? "" : "1rem" }}
                                        >
                                            Cancel
                                        </Button>
                                    </motion.div>
                                    <motion.div>
                                        {/* LoadingButton -> Button (primary, loading) */}
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={reviewStatus === 'pending'}
                                            size={isMobile ? "small" : "middle"}
                                            style={{ textTransform: "none", fontSize: isMobile ? "" : "1rem" }}
                                        >
                                            Add review
                                        </Button>
                                    </motion.div>
                                </MotionConfig>
                            </Flex>
                        </Flex>
                    </Form>
                ) : (
                    !loggedInUser?.isAdmin && (
                        <motion.div onClick={() => setWriteReview(!writeReview)} whileHover={{ scale: 1.050 }} whileTap={{ scale: 1 }} style={{ width: "fit-content" }}>
                            {/* Button -> Button (primary) */}
                            <Button
                                type="primary" // Tương đương variant="contained"
                                size={isMobile ? "middle" : 'large'}
                                icon={<EditOutlined />} // CreateIcon -> EditOutlined
                                style={{ textTransform: "none", fontSize: "1rem", borderRadius: 6 }}
                            >
                                Write a review
                            </Button>
                        </motion.div>
                    )
                )
            }
        </Flex>
    );
}