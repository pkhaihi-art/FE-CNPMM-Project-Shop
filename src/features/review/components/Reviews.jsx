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
    // Stack -> Flex (dọc)
        <Flex vertical gap={40} align="flex-start" style={{ width: containerWidth }}>

            {/* Phần tóm tắt đánh giá */}
            <Flex vertical style={{ width: '100%' }}>
                <Title level={4} style={{ fontWeight: 400, marginBottom: '0.5em' }}>Đánh giá</Title>
                {
                    reviews?.length ? (
                        <Flex vertical gap={24}>
                            {/* Điểm trung bình */}
                            <Flex vertical gap={8}>
                                <Title level={2} style={{ fontWeight: 800, margin: 0 }}>{averageRating}.0</Title>
                                {/* Rating -> Rate */}
                                <Rate disabled allowHalf value={averageRating} />
                                <Text type="secondary" style={{ fontSize: '1.1rem' }}>
                                    Dựa trên {reviews.length} {reviews.length === 1 ? "đánh giá" : "đánh giá"}
                                </Text>
                            </Flex>

                            {/* Thanh tiến trình từng mức sao */}
                            <Flex vertical gap={16}>
                                {
                                    [5, 4, 3, 2, 1].map((number) => {
                                        const percent = (ratingCounts[number] / reviews.length) * 100;
                                        return (
                                            <Flex key={number} align="center" gap={8} style={{ width: '100%' }}>
                                                <Text style={{ whiteSpace: "nowrap" }}>{number} sao</Text>
                                                <Progress
                                                    percent={percent}
                                                    showInfo={false}
                                                    style={{ flex: 1 }}
                                                    strokeWidth={10}
                                                    strokeColor={"#1976d2"}
                                                />
                                                <Text style={{ minWidth: 40, textAlign: 'right' }}>{parseInt(percent)}%</Text>
                                            </Flex>
                                        );
                                    })
                                }
                            </Flex>
                        </Flex>
                    ) : (
                        <Text type="secondary" style={{ fontSize: '1.1rem' }}>
                            {loggedInUser?.isAdmin ? "Hiện chưa có đánh giá nào" : "Hãy là người đầu tiên viết đánh giá!"}
                        </Text>
                    )
                }
            </Flex>

            {/* Danh sách đánh giá */}
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

            {/* Form thêm đánh giá */}
            {
                writeReview ? (
                    <Form layout="vertical" onFinish={handleSubmit(handleAddReview)} style={{ width: '100%' }}>
                        <Flex vertical gap={24}>
                            {/* Trường nhập nội dung */}
                            <Form.Item
                                validateStatus={errors.comment ? 'error' : ''}
                                help={errors.comment ? "Vui lòng nhập nội dung đánh giá" : null}
                                style={{ marginTop: 16, width: isTablet ? '100%' : '40rem', marginBottom: 0 }}
                            >
                                <Input.TextArea
                                    {...register("comment", { required: true })}
                                    rows={6}
                                    placeholder='Viết cảm nhận của bạn...'
                                />
                            </Form.Item>

                            {/* Chọn số sao */}
                            <Flex vertical gap={4}>
                                <Text>Bạn hài lòng với sản phẩm bao nhiêu?</Text>
                                <motion.div style={{ width: "fit-content" }} whileHover={{ scale: 1.050, x: 2 }} whileTap={{ scale: 1 }}>
                                    <Rate
                                        style={{ fontSize: 24 }}
                                        value={value}
                                        onChange={setValue}
                                    />
                                </motion.div>
                            </Flex>

                            {/* Nút hành động */}
                            <Flex justify="flex-end" gap={8}>
                                <MotionConfig whileTap={{ scale: 1 }} whileHover={{ scale: 1.050 }}>
                                    <motion.div>
                                        <Button
                                            danger
                                            onClick={handleCancelWrite}
                                            size={isMobile ? "small" : "middle"}
                                            style={{ textTransform: "none", fontSize: isMobile ? "" : "1rem" }}
                                        >
                                            Hủy
                                        </Button>
                                    </motion.div>
                                    <motion.div>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={reviewStatus === 'pending'}
                                            size={isMobile ? "small" : "middle"}
                                            style={{ textTransform: "none", fontSize: isMobile ? "" : "1rem" }}
                                        >
                                            Gửi đánh giá
                                        </Button>
                                    </motion.div>
                                </MotionConfig>
                            </Flex>
                        </Flex>
                    </Form>
                ) : (
                    !loggedInUser?.isAdmin && (
                        <motion.div onClick={() => setWriteReview(!writeReview)} whileHover={{ scale: 1.050 }} whileTap={{ scale: 1 }} style={{ width: "fit-content" }}>
                            <Button
                                type="primary"
                                size={isMobile ? "middle" : 'large'}
                                icon={<EditOutlined />}
                                style={{ textTransform: "none", fontSize: "1rem", borderRadius: 6 }}
                            >
                                Viết đánh giá
                            </Button>
                        </motion.div>
                    )
                )
            }
        </Flex>
    )
};