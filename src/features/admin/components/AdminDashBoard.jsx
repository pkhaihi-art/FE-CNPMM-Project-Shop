import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Card, Row, Col, Statistic } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminOrders } from './AdminOrders';
import { AdminBrand } from './AdminBrand';
import { AdminUser } from './AdminUser';
import { AdminProducts } from './AdminProducts';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// API helpers
import { fetchAllUsers } from '../../admin/AdminUserApi';
import { fetchAllBrands } from '../../brands/BrandApi.jsx';
import { fetchAllCategories } from '../../categories/CategoriesApi.jsx';
import { fetchProducts } from '../../products/ProductApi.jsx';
import { getAllOrders } from '../../order/OrderApi.jsx';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export const AdminDashboard = () => {
  const sortedData = [];
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    users: 0,
    products: 0,
    categories: 0,
    brands: 0,
    revenue: 0,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const [selectedContent, setSelectedContent] = useState(
    location.pathname.split('/')[2] || 'dashboard'
  );

  useEffect(() => {
    const loadStatistics = async () => {
      setLoading(true);
      try {
        // Request important resources in parallel
        console.log('Fetching admin dashboard statistics...');
        const [usersRes, brandsRes, categoriesRes, productsRes, ordersRes] = await Promise.all([
          fetchAllUsers(),
          fetchAllBrands(),
          fetchAllCategories(),
          fetchProducts({ pagination: { page: 1, limit: 1 } }),
          getAllOrders(),
        ]);

        console.log('Users API response:', usersRes);
        console.log('Brands API response:', brandsRes);
        console.log('Categories API response:', categoriesRes);
        console.log('Products API response:', productsRes);
        console.log('Orders API response:', ordersRes);

        // Users API trả về { message, users: [...], total }
        const usersCount = usersRes?.users?.length || usersRes?.total || 0;
        const brandsCount = Array.isArray(brandsRes) ? brandsRes.length : 0;
        const categoriesCount = Array.isArray(categoriesRes) ? categoriesRes.length : 0;
        const productsCount = productsRes && productsRes.totalResults ? Number(productsRes.totalResults) : (Array.isArray(productsRes) ? productsRes.length : 0);

        // Chuyển ordersRes về mảng nếu không phải mảng
        const orders = Array.isArray(ordersRes) ? ordersRes : [];
        console.log('Processing orders:', orders);

        // Tính tổng doanh thu
        const revenueTotal = orders.reduce((acc, order) => acc + (Number(order.total) || 0), 0);

        setStatistics({
          users: usersCount,
          products: productsCount,
          categories: categoriesCount,
          brands: brandsCount,
          revenue: revenueTotal,
        });

        // Khởi tạo dữ liệu cho 6 tháng gần nhất
        const now = new Date();
        const monthlyData = new Map();

        // Tạo khung 6 tháng với doanh thu = 0
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyData.set(monthKey, {
            month: `Tháng ${date.getMonth() + 1}`,
            revenue: 0,
            year: date.getFullYear()
          });
        }

        // Tính doanh thu theo tháng từ orders
        orders.forEach(order => {
          if (!order.createdAt) return;
          const orderDate = new Date(order.createdAt);
          const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
          
          if (monthlyData.has(monthKey)) {
            const currentData = monthlyData.get(monthKey);
            currentData.revenue += Number(order.total) || 0;
            monthlyData.set(monthKey, currentData);
          }
        });

        // Chuyển Map thành mảng và sắp xếp theo thời gian
        sortedData = Array.from(monthlyData.values())
          .sort((a, b) => {
            const monthA = parseInt(a.month.split(' ')[1]);
            const monthB = parseInt(b.month.split(' ')[1]);
            return monthA - monthB;
          });

        console.log('Sorted monthly revenue data:', sortedData);

      } catch (err) {
        // Keep fallback sample data on error
        console.error('Admin dashboard stats load error:', err);
        if (err.response) {
          console.error('API Error Response:', {
            status: err.response.status,
            data: err.response.data
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Bảng điều khiển',
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: 'Sản phẩm',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Người dùng',
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: 'Đơn hàng',
    },
    {
      key: 'brands',
      icon: <TagOutlined />,
      label: 'Thương hiệu',
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (
      key === 'orders' ||
      key === 'brands' ||
      key === 'users' ||
      key === 'products' ||
      key === 'dashboard'
    ) {
      setSelectedContent(key);
      return;
    }
    const routeMap = {};
    const path = routeMap[key] || '/admin';
    navigate(path);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Thanh điều hướng bên trái */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
        }}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        />
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          selectedKeys={[
            selectedContent || location.pathname.split('/')[2] || 'dashboard',
          ]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout>
        {/* Thanh tiêu đề */}
        <Header
          style={{
            padding: 0,
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              style: {
                padding: '0 24px',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'color 0.3s',
              },
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>

        {/* Nội dung chính */}
        <Content
          style={{ margin: '24px 16px', padding: 24, background: '#fff' }}
        >
          {selectedContent === 'dashboard' && (
            <>
              <Title level={2} style={{ marginBottom: 24 }}>
                Tổng quan hệ thống
              </Title>

              {/* Thẻ thống kê */}
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Tổng người dùng"
                      value={statistics.users}
                      prefix={<UserOutlined />}
                      loading={loading}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Tổng sản phẩm"
                      value={statistics.products}
                      prefix={<ShoppingOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Danh mục"
                      value={statistics.categories}
                      prefix={<TagOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Tổng doanh thu"
                      value={statistics.revenue}
                      prefix="VNĐ"
                      formatter={(value) =>
                        value.toLocaleString('vi-VN', {
                          maximumFractionDigits: 0,
                        })
                      }
                    />
                  </Card>
                </Col>
              </Row>

              {/* Biểu đồ doanh thu */}
              <Card style={{ marginTop: 24 }} loading={loading}>
                <Title level={4}>Tổng quan doanh thu</Title>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={sortedData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month"
                        axisLine={true}
                        tickLine={true}
                      />
                      <YAxis
                        tickFormatter={(value) =>
                          `${(value / 1000000).toFixed(1)}M`
                        }
                        axisLine={true}
                        tickLine={true}
                      />
                      <Tooltip
                        formatter={(value) =>
                          `${value.toLocaleString('vi-VN')} VNĐ`
                        }
                        labelStyle={{ color: 'black' }}
                      />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        fill="#1890ff"
                        name="Doanh thu"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </>
          )}

          {selectedContent === 'orders' && (
            <div style={{ width: '100%' }}>
              <AdminOrders />
            </div>
          )}

          {selectedContent === 'brands' && (
            <div style={{ width: '100%' }}>
              <AdminBrand />
            </div>
          )}
          {selectedContent === 'users' && (
            <div style={{ width: '100%' }}>
              <AdminUser />
            </div>
          )}
          {selectedContent === 'products' && (
            <div style={{ width: '100%' }}>
              <AdminProducts />
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};
