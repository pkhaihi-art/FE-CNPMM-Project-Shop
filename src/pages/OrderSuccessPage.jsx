import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetCurrentOrder, selectCurrentOrder } from '../features/order/OrderSlice';
import { selectUserInfo } from '../features/user/UserSlice';
import { orderSuccessAnimation } from '../assets';
import Lottie from 'lottie-react';
import { Button, Card, Typography, Grid, theme as antdTheme } from 'antd';
import { useTranslation } from 'react-i18next';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';

const { Title, Text } = Typography;

export const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentOrder = useSelector(selectCurrentOrder);
  const userDetails = useSelector(selectUserInfo);
  const { id } = useParams();
  const { t } = useTranslation();

  const token = antdTheme.useToken();
  const screens = useBreakpoint();
  const isMobile = !screens.md; // < 768px

  useEffect(() => {
    if (!currentOrder) {
      navigate('/');
    }
  }, [currentOrder, navigate]);

  return (
    <Grid
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: token.token.colorBgBase,
      }}
    >
      <Card
        bordered={!isMobile}
        style={{
          boxShadow: isMobile ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
          padding: isMobile ? 16 : 32,
          textAlign: 'center',
          maxWidth: 500,
        }}
      >
        {/* Animation */}
        <div style={{ width: '10rem', height: '7rem', margin: '0 auto' }}>
          <Lottie animationData={orderSuccessAnimation} />
        </div>

        {/* Text */}
        <div style={{ marginTop: 24 }}>
          <Title level={5} style={{ fontWeight: 400 }}>
            Hey {userDetails?.name}
          </Title>
          <Title level={4}>Your Order #{currentOrder?._id} is confirmed</Title>
          <Text type="secondary">{t('order_thank_you')}</Text>
        </div>

        {/* Button */}
        <Button
          type="primary"
          block={isMobile}
          size={isMobile ? 'middle' : 'large'}
          style={{ marginTop: 24 }}
          onClick={() => dispatch(resetCurrentOrder())}
        >
          <Link to="/orders" style={{ color: '#fff' }}>
            Check order status in my orders
          </Link>
        </Button>
      </Card>
    </Grid>
  );
};
