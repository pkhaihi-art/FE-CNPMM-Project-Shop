import * as React from 'react';
import { Layout, Flex, Typography, Dropdown, Avatar, Tooltip, Badge, Button, Tag, Space, Grid, theme } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../user/UserSlice';
import { selectCartItems } from '../../cart/CartSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectProductIsFilterOpen, toggleFilters } from '../../products/ProductSlice';
import {
    ShoppingCartOutlined,
    HeartOutlined,
    FilterOutlined,
    UserOutlined
} from '@ant-design/icons';

const { Header } = Layout;
const { Title, Text } = Typography;

export const Navbar = ({ isProductList = false }) => {
    const userInfo = useSelector(selectUserInfo);
    const cartItems = useSelector(selectCartItems);
    const loggedInUser = useSelector(selectLoggedInUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const screens = Grid.useBreakpoint(); // AntD hook for responsiveness
    const { token } = theme.useToken(); // AntD hook for theme tokens

    const wishlistItems = useSelector(selectWishlistItems);
    const isProductFilterOpen = useSelector(selectProductIsFilterOpen);

    const handleToggleFilters = () => {
        dispatch(toggleFilters());
    };

    const settings = [
        { name: "Trang chủ", to: "/" },
        { name: 'Hồ sơ', to: loggedInUser?.isAdmin ? "/admin/profile" : "/profile" },
        { name: loggedInUser?.isAdmin ? 'Đơn hàng' : 'Đơn hàng của tôi', to: loggedInUser?.isAdmin ? "/admin/orders" : "/orders" },
        ...(loggedInUser?.isAdmin ? [{ name: "Thương hiệu", to: "/admin/brand" }] : []),
        ...(loggedInUser?.isAdmin ? [{ name: "Người dùng", to: "/admin/user" }] : []),
        { name: 'Đăng xuất', to: "/logout" },
    ];

    // Build menu items for AntD Dropdown
    const menuItems = [
        loggedInUser?.isAdmin && {
            key: 'add-product',
            label: <Link to="/admin/add-product">Thêm sản phẩm mới</Link>,
        },
        ...settings.map((setting) => ({
            key: setting.to,
            label: <Link to={setting.to}>{setting.name}</Link>,
        })),
    ].filter(Boolean); // Filter out false values (if not admin)

    return (
        <Header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                width: '100%',
                backgroundColor: token.colorBgBase, // 'white'
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                color: token.colorText, // 'text.primary'
                padding: '0 24px',
                height: '4rem',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
            }}
        >
            <Title
                level={4}
                style={{
                    margin: 0,
                    letterSpacing: '.3rem',
                    display: screens.md ? 'block' : 'none', // { xs: 'none', md: 'flex' }
                }}
            >
                <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                    TECH SHOP
                </Link>
            </Title>

            <Flex align="center" gap="middle">
                <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow trigger={['click']}>
                    <Tooltip title="Mở cài đặt">
                        <Avatar
                            alt={userInfo?.name || 'Người dùng'}
                            src={null} // Set to null to show icon or children
                            icon={<UserOutlined />}
                            style={{ cursor: 'pointer' }}
                        />
                    </Tooltip>
                </Dropdown>

                <Text strong>
                    {/* Replaced is480 with !screens.sm */}
                    {!screens.sm
                        ? `${userInfo?.name?.toString().split(" ")[0] || 'Người dùng'}`
                        : `Xin chào👋, ${userInfo?.name || 'Người dùng'}`}
                </Text>

                {loggedInUser.isAdmin && <Tag color="blue">Quản trị</Tag>}

                <Space size="middle">
                    {cartItems?.length > 0 && (
                        <Badge count={cartItems.length} color='red'>
                            <Button
                                type="text"
                                shape="circle"
                                icon={<ShoppingCartOutlined />}
                                onClick={() => navigate("/cart")}
                            />
                        </Badge>
                    )}

                    {!loggedInUser?.isAdmin && (
                        <Badge count={wishlistItems?.length} color='red'>
                            <Link to={"/wishlist"}>
                                <Button
                                    type="text"
                                    shape="circle"
                                    icon={<HeartOutlined />}
                                />
                            </Link>
                        </Badge>
                    )}

                    {isProductList && (
                        <Button
                            type="text"
                            shape="circle"
                            icon={<FilterOutlined />}
                            onClick={handleToggleFilters}
                            style={{ color: isProductFilterOpen ? token.colorPrimary : token.colorText }}
                        />
                    )}
                </Space>
            </Flex>
        </Header>
    );
};