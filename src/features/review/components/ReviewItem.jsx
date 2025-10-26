import { Card, Rate, Typography, Flex, Dropdown, Button, Input, Form, Grid, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { deleteReviewByIdAsync, selectReviewStatus, updateReviewByIdAsync } from '../ReviewSlice';
import { useForm } from "react-hook-form";

const { Text, Paragraph, Title } = Typography;
const { useBreakpoint } = Grid;

export const ReviewItem = ({ id, username, userid, comment, rating, createdAt }) => {

  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectLoggedInUser);
  const status = useSelector(selectReviewStatus); // Giả định status là 'idle' | 'loading'
  
  //Sử dụng defaultValues và setValue để quản lý form tốt hơn
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      comment: comment
    }
  });
  
  const [edit, setEdit] = useState(false);
  const [editRating, setEditRating] = useState(rating);
  
  // Tương đương với is480 của MUI
  const screens = useBreakpoint();
  const isMobile = !screens.sm; // < 576px (breakpoint `sm` của Antd)

  // Xử lý logic xóa
  const deleteReview = () => {
    dispatch(deleteReviewByIdAsync(id));
    // Không cần handleClose vì Dropdown tự đóng
  };

  // Xử lý logic cập nhật
  const handleUpdateReview = (data) => {
    const update = { ...data, _id: id, rating: editRating };
    dispatch(updateReviewByIdAsync(update));
    setEdit(false);
  };
  
  // Xử lý logic hủy edit
  const handleCancel = () => {
    setEdit(false);
    setEditRating(rating); // Reset rating về giá trị ban đầu
    setValue("comment", comment); // Reset text trong form
  }

  // Cập nhật giá trị form khi chế độ edit được bật
  useEffect(() => {
    if (edit) {
      setValue("comment", comment);
      setEditRating(rating);
    }
  }, [edit, comment, rating, setValue]);

  const isOwnReview = userid === loggedInUser?._id;

  // Định nghĩa các item cho menu dropdown
  const menuItems = [
    {
      key: '1',
      label: 'Edit',
      onClick: () => setEdit(true),
    },
    {
      key: '2',
      label: 'Delete',
      onClick: deleteReview,
      danger: true, // Thêm style màu đỏ cho hành động nguy hiểm
    },
  ];

  // Title của Card, chứa username và rating
  const cardTitle = (
    <Flex vertical>
      <Title level={5} style={{ margin: 0 }}>{username}</Title>
      <Rate
        // Antd dùng `disabled` thay vì `readOnly`
        disabled={!edit} 
        // Antd `Rate` không có prop `size`, ta dùng fontSize
        style={{ fontSize: edit ? (isMobile ? 20 : 24) : 16 }}
        onChange={setEditRating} // Antd `Rate` truyền trực tiếp value, không qua event
        value={edit ? editRating : rating}
      />
    </Flex>
  );

  // Phần "extra" của Card, chứa ngày và menu (nếu có)
  const cardExtra = (
    <Space align="center">
      <Text type="secondary" style={{ fontSize: '.9rem' }}>
        {new Date(createdAt).toDateString()}
      </Text>
      {isOwnReview && (
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          {/* Antd không có IconButton, ta dùng Button với icon */}
          <Button type="text" shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      )}
    </Space>
  );

  return (
    <Card
      title={cardTitle}
      extra={cardExtra}
      style={{ width: '100%', borderRadius: 8 }} // Antd dùng đơn vị pixel hoặc số
    >
      {/* Nội dung Card: comment hoặc form edit */}
      {
        edit ? (
          <Form layout="vertical" onFinish={handleSubmit(handleUpdateReview)}>
            <Form.Item
              // Liên kết lỗi từ react-hook-form với Form.Item của Antd
              validateStatus={errors.comment ? 'error' : ''}
              help={errors.comment?.message}
            >
              <Input.TextArea
                rows={4}
                {...register("comment", { required: "Comment is required" })}
              />
            </Form.Item>
            
            <Form.Item style={{ marginBottom: 0 }}>
              <Flex justify="flex-end" gap="small">
                <Button onClick={handleCancel} danger>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  // Antd Button có sẵn prop `loading`
                  loading={status === 'loading'}
                >
                  Update
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        ) : (
          <Paragraph type="secondary">
            {comment}
          </Paragraph>
        )
      }
    </Card>
  );
};