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
// no redux dispatch needed in this component

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [statistics, setStatistics] = useState({
    users: 0,
    products: 0,
    categories: 0,
    brands: 0,
    revenue: 0,
  });

  const location = useLocation();
  const navigate = useNavigate();
  // dispatch not required here
  const [selectedContent, setSelectedContent] = useState(
    location.pathname.split('/')[2] || 'dashboard'
  );

  // Sample data for the revenue chart
  const revenueData = [
    { month: 'Jan', revenue: 3000 },
    { month: 'Feb', revenue: 4500 },
    { month: 'Mar', revenue: 3800 },
    { month: 'Apr', revenue: 5200 },
    { month: 'May', revenue: 4800 },
    { month: 'Jun', revenue: 6000 },
  ];

  useEffect(() => {
    // Here you would fetch the actual statistics from your API
    // For now using dummy data
    setStatistics({
      users: 150,
      products: 300,
      categories: 12,
      brands: 25,
      revenue: 25000,
    });
  }, []);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: 'Products',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: 'Orders',
    },
    {
      key: 'brands',
      icon: <TagOutlined />,
      label: 'Brands',
    },
  ];

  const handleMenuClick = ({ key }) => {
    // Show all admin pages inside dashboard content
    if (key === 'orders' || key === 'brands' || key === 'users' || key === 'products' || key === 'dashboard') {
      setSelectedContent(key);
      return;
    }
    // No external routes needed anymore
    const routeMap = {};
    const path = routeMap[key] || '/admin';
    navigate(path);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"
        style={{
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
        }}
      >
        <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)' }}>
          {/* Logo placeholder */}
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          selectedKeys={[selectedContent || (location.pathname.split('/')[2] || 'dashboard')]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
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
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {selectedContent === 'dashboard' && (
            <>
              <Title level={2} style={{ marginBottom: 24 }}>Dashboard Overview</Title>

              {/* Statistics Cards */}
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Total Users"
                      value={statistics.users}
                      prefix={<UserOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Total Products"
                      value={statistics.products}
                      prefix={<ShoppingOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Categories"
                      value={statistics.categories}
                      prefix={<TagOutlined />}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Total Revenue"
                      value={statistics.revenue}
                      prefix="$"
                    />
                  </Card>
                </Col>
              </Row>

              {/* Revenue Chart */}
              <Card style={{ marginTop: 24 }}>
                <Title level={4}>Revenue Overview</Title>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={revenueData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#1890ff" name="Revenue" />
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