import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllUsersAsync,
    blockUserAsync,
    unblockUserAsync,
    selectAdminUsers,
} from "../AdminUserSlice";
import {
    Flex,
    Typography,
    Row,
    Col,
    Button,
    Card,
    Space,
    message,
    Modal,
    Tag,
} from "antd";
import {
    LockOutlined,
    UnlockOutlined,
    MailOutlined,
    UserOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    CrownOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export const AdminUser = () => {
    const dispatch = useDispatch();
    const users = useSelector(selectAdminUsers);

    useEffect(() => {
        dispatch(fetchAllUsersAsync());
    }, [dispatch]);

    const handleBlockUser = (userId) => {
        Modal.confirm({
            title: "Bạn có chắc muốn khóa người dùng này?",
            content: "Người dùng sẽ không thể đăng nhập cho đến khi được mở khóa.",
            okText: "Khóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk() {
                dispatch(blockUserAsync(userId))
                    .unwrap()
                    .then(() => {
                        message.warning("Đã khóa người dùng!");
                        dispatch(fetchAllUsersAsync()); // Refresh danh sách
                    })
                    .catch((error) => {
                        message.error(error?.message || "Không thể khóa người dùng!");
                    });
            },
        });
    };

    const handleUnblockUser = (userId) => {
        Modal.confirm({
            title: "Bạn có chắc muốn mở khóa người dùng này?",
            content: "Người dùng sẽ có thể đăng nhập lại.",
            okText: "Mở khóa",
            okType: "primary",
            cancelText: "Hủy",
            onOk() {
                dispatch(unblockUserAsync(userId))
                    .unwrap()
                    .then(() => {
                        message.success("Đã mở khóa người dùng!");
                        dispatch(fetchAllUsersAsync()); // Refresh danh sách
                    })
                    .catch((error) => {
                        message.error(error?.message || "Không thể mở khóa người dùng!");
                    });
            },
        });
    };

    return (
        <Flex vertical gap="large" style={{ padding: 24 }}>
            <Title level={4}>Quản lý người dùng</Title>

            <Row gutter={[16, 16]}>
                {users.map((user) => {
                    // isVerified = true nghĩa là hoạt động, false = bị khóa
                    const isBlocked = !user.isVerified;

                    return (
                        <Col xs={24} sm={12} md={8} key={user._id}>
                            <Card hoverable>
                                <Flex vertical gap="small">
                                    {/* Tên người dùng */}
                                    <Space>
                                        <UserOutlined />
                                        <Text strong>{user.name || "Chưa có tên"}</Text>
                                        {user.isAdmin && (
                                            <Tag color="gold" icon={<CrownOutlined />}>
                                                Admin
                                            </Tag>
                                        )}
                                    </Space>

                                    {/* Email */}
                                    <Space>
                                        <MailOutlined />
                                        <Text type="secondary">
                                            {user.email || "Không có email"}
                                        </Text>
                                    </Space>

                                    {/* Trạng thái xác minh */}
                                    <Space>
                                        <Text>Trạng thái:</Text>
                                        {user.isVerified ? (
                                            <Tag color="green" icon={<CheckCircleOutlined />}>
                                                Đã xác minh
                                            </Tag>
                                        ) : (
                                            <Tag color="red" icon={<CloseCircleOutlined />}>
                                                Bị khóa
                                            </Tag>
                                        )}
                                    </Space>

                                    {/* Nút thao tác - Không cho phép khóa/mở khóa Admin */}
                                    {!user.isAdmin && (
                                        <Space style={{ marginTop: 16 }}>
                                            <Button
                                                type={isBlocked ? "primary" : "default"}
                                                danger={!isBlocked}
                                                icon={
                                                    isBlocked ? (
                                                        <UnlockOutlined />
                                                    ) : (
                                                        <LockOutlined />
                                                    )
                                                }
                                                onClick={() =>
                                                    isBlocked
                                                        ? handleUnblockUser(user._id)
                                                        : handleBlockUser(user._id)
                                                }
                                            >
                                                {isBlocked ? "Mở khóa" : "Khóa"}
                                            </Button>
                                        </Space>
                                    )}

                                    {user.isAdmin && (
                                        <Text type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
                                            Tài khoản Admin không thể bị khóa
                                        </Text>
                                    )}
                                </Flex>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </Flex>
    );
};