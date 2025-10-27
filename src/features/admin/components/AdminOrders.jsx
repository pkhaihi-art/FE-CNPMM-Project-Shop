import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersAsync, resetOrderUpdateStatus, selectOrderUpdateStatus, selectOrders, updateOrderByIdAsync } from '../../order/OrderSlice';
import { Table, Flex, Avatar, Button, Select, Space, Typography, Tag, message } from 'antd';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import { noOrdersAnimation } from '../../../assets/index';
import Lottie from 'lottie-react';

const { Text, Title } = Typography;
const { Option } = Select;

export const AdminOrders = () => {
    const dispatch = useDispatch();
    const orders = useSelector(selectOrders);
    const [editIndex, setEditIndex] = useState(-1);
    const [newStatus, setNewStatus] = useState('');
    const orderUpdateStatus = useSelector(selectOrderUpdateStatus);

    useEffect(() => {
        dispatch(getAllOrdersAsync());
    }, [dispatch]);

    useEffect(() => {
        if (orderUpdateStatus === 'fulfilled') {
            message.success("Status updated");
        } else if (orderUpdateStatus === 'rejected') {
            message.error("Error updating order status");
        }
    }, [orderUpdateStatus]);

    useEffect(() => {
        return () => {
            dispatch(resetOrderUpdateStatus());
        };
    }, [dispatch]);

    const handleUpdateOrder = () => {
        const update = { status: newStatus, _id: orders[editIndex]._id };
        setEditIndex(-1);
        dispatch(updateOrderByIdAsync(update));
    };

    const editOptions = ['Pending', 'Confirmed', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled', 'Cancellation Requested'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'processing';
            case 'Confirmed':
                return 'default';
            case 'Preparing':
                return 'warning';
            case 'Out for delivery':
                return 'blue';
            case 'Delivered':
                return 'success';
            case 'Cancelled':
                return 'error';
            case 'Cancellation Requested':
                return 'warning';
            default:
                return 'default';
        }
    };

    const columns = [
    {
        title: 'STT',
        key: 'orderIndex',
        render: (text, record, index) => index + 1,
    },
    {
        title: 'Mã đơn hàng',
        dataIndex: '_id',
        key: '_id',
        ellipsis: true,
        width: 100,
    },
    {
        title: 'Sản phẩm',
        dataIndex: 'item',
        key: 'item',
        render: (items) => (
            <Space direction="vertical">
                {items.map((product) => (
                    <Space key={product.product._id}>
                        <Avatar src={product.product.thumbnail} />
                        <Text>{product.product.title}</Text>
                    </Space>
                ))}
            </Space>
        ),
    },
    {
        title: 'Tổng tiền',
        dataIndex: 'total',
        key: 'total',
        render: (total) =>
            new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(total),
    },
    {
        title: 'Địa chỉ giao hàng',
        dataIndex: 'address',
        key: 'address',
        render: (address) => (
            <Flex vertical>
                <Text>{address[0].street}</Text>
                <Text>{address[0].city}</Text>
                <Text>{address[0].state}</Text>
                <Text>{address[0].postalCode}</Text>
            </Flex>
        ),
    },
    {
        title: 'Phương thức thanh toán',
        dataIndex: 'paymentMode',
        key: 'paymentMode',
    },
    {
        title: 'Ngày đặt hàng',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status, record, index) => {
            if (editIndex === index) {
                return (
                    <Select
                        defaultValue={status}
                        style={{ width: 150 }}
                        onChange={(value) => setNewStatus(value)}
                    >
                        {editOptions.map((option) => (
                            <Option key={option} value={option}>
                                {option}
                            </Option>
                        ))}
                    </Select>
                );
            }
            return <Tag color={getStatusColor(status)}>{status}</Tag>;
        },
    },
    {
        title: 'Hành động',
        key: 'actions',
        render: (text, record, index) => {
            if (editIndex === index) {
                return (
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<CheckOutlined />}
                        onClick={handleUpdateOrder}
                    />
                );
            }
            return (
                <Button
                    shape="circle"
                    icon={<EditOutlined />}
                    onClick={() => {
                        setEditIndex(index);
                        setNewStatus(record.status);
                    }}
                />
            );
        },
    },
];


    return (
    <Flex justify="center" align="center" style={{ width: '100%' }}>
        <Flex vertical style={{ width: '100%', margin: '40px 0' }} align="center">
            {orders.length ? (
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="_id"
                    style={{ width: '95vw' }}
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        showTotal: (total) => `Tổng cộng ${total} đơn hàng`,
                    }}
                />
            ) : (
                <Flex vertical align="center" style={{ maxWidth: '30rem' }}>
                    <Lottie animationData={noOrdersAnimation} />
                    <Title level={4} style={{ fontWeight: 400, textAlign: 'center' }}>
                        Hiện tại chưa có đơn hàng nào
                    </Title>
                </Flex>
            )}
        </Flex>
    </Flex>
)};