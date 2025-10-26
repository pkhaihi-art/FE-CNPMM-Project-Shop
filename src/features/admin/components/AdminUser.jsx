import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllUsersAsync,
    updateUserByAdminAsync,
    deleteUserByAdminAsync,
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
    Select,
    Card,
    Space,
    message,
    Modal,
    Tag,
} from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    LockOutlined,
    UnlockOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

export const AdminUser = () => {
    const dispatch = useDispatch();
    const users = useSelector(selectAdminUsers);
    const [editingId, setEditingId] = useState(null);
    const [role, setRole] = useState("");

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
                dispatch(blockUserAsync(userId));
                message.warning("Đã khóa người dùng!");
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
                dispatch(unblockUserAsync(userId));
                message.success("Đã mở khóa người dùng!");
            },
        });
    };

    const handleUpdateRole = (id) => {
        if (!role) return message.warning("Hãy chọn vai trò mới!"); // Dùng message
        dispatch(updateUserByAdminAsync({ id, data: { role } }));
        setEditingId(null);
        message.info("Đã cập nhật vai trò!"); // Dùng message
    };

    const handleDelete = (id) => {
        // Dùng Modal.confirm của AntD
        Modal.confirm({
            title: "Bạn có chắc muốn xóa người dùng này?",
            content: "Hành động này không thể hoàn tác.",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk() {
                dispatch(deleteUserByAdminAsync(id));
                message.error("Đã xóa người dùng!"); // Dùng message
            },
        });
    };

    return (
        // Stack -> Flex, p={4} -> style padding, rowGap={4} -> gap="large"
        <Flex vertical gap="large" style={{ padding: 24 }}>
            <Title level={4}>User Management</Title>

            {/* Grid container -> Row */}
            {/* spacing={2} (16px) -> gutter={[16, 16]} */}
            <Row gutter={[16, 16]}>
                {users.map((user) => (
                    // Grid item -> Col
                    // MUI 12 cột -> AntD 24 cột
                    // xs={12} -> xs={24}
                    // sm={6}  -> sm={12}
                    // md={4}  -> md={8}
                    <Col xs={24} sm={12} md={8} key={user._id}>
                        {/* Stack (border, p) -> Card */}
                        <Card>
                            {/* Stack (spacing={1}) -> Flex (gap="small") */}
                            <Flex vertical gap="small">
                                <Text strong>{user.name}</Text>
                                <Text type="secondary">{user.email}</Text>
                                <Space>
                                    <Text>Role: </Text>
                                    <Tag color={user.role === 'admin' ? 'blue' : 'default'}>
                                        {user.role}
                                    </Tag>
                                </Space>
                                <Space>
                                    <Text>Status: </Text>
                                    <Tag color={user.blocked ? 'red' : 'green'}>
                                        {user.blocked ? 'Blocked' : 'Active'}
                                    </Tag>
                                </Space>

                                {editingId === user._id ? (
                                    // Stack (row, mt) -> Space (mt)
                                    <Space style={{ marginTop: 16 }}>
                                        <Select
                                            size="small"
                                            value={role}
                                            onChange={(value) => setRole(value)} // AntD onChange trả về value
                                            style={{ width: 120 }}
                                        >
                                            <Option value="user">User</Option>
                                            <Option value="admin">Admin</Option>
                                        </Select>
                                        <Button
                                            size="small"
                                            type="primary" // variant="contained" -> type="primary"
                                            onClick={() => handleUpdateRole(user._id)}
                                        >
                                            Lưu
                                        </Button>
                                        <Button
                                            size="small"
                                            danger // color="error" -> danger
                                            onClick={() => setEditingId(null)}
                                        >
                                            Hủy
                                        </Button>
                                    </Space>
                                ) : (
                                    <Space style={{ marginTop: 16 }}>
                                        {/* IconButton -> Button shape="circle" */}
                                        <Button
                                            type="primary"
                                            shape="circle"
                                            icon={<EditOutlined />}
                                            onClick={() => {
                                                setEditingId(user._id);
                                                setRole(user.role);
                                            }}
                                            title="Edit Role"
                                        />
                                        <Button
                                            type={user.blocked ? "primary" : "default"}
                                            shape="circle"
                                            icon={user.blocked ? <UnlockOutlined /> : <LockOutlined />}
                                            onClick={() => user.blocked ? 
                                                handleUnblockUser(user._id) : 
                                                handleBlockUser(user._id)
                                            }
                                            title={user.blocked ? "Unblock User" : "Block User"}
                                        />
                                        <Button
                                            danger
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleDelete(user._id)}
                                            title="Delete User"
                                        />
                                    </Space>
                                )}
                            </Flex>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Flex>
    );
};