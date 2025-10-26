import React, { useEffect, useState } from 'react';
import { Navbar } from '../features/navigation/components/Navbar';
import { ProductCard } from '../features/products/components/ProductCard';
import { ProductList } from '../features/products/components/ProductList';
import { resetAddressStatus, selectAddressStatus } from '../features/address/AddressSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Footer } from '../features/footer/Footer';
import { axiosi } from '../config/axios';
import { Row, Col, Typography, Space, Divider } from 'antd';


export const HomePage = () => {
  const dispatch = useDispatch();
  const addressStatus = useSelector(selectAddressStatus);

  const [newest, setNewest] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [highestDiscount, setHighestDiscount] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(''); // '' là tất cả sản phẩm

  useEffect(() => {
    if (addressStatus === 'fulfilled') {
      dispatch(resetAddressStatus());
    }
  }, [addressStatus, dispatch]);

  useEffect(() => {
    // Gọi API cho từng feature
    const fetchProducts = async (feature, setter) => {
      try {
        const res = await axiosi.get(`/products?feature=${feature}&limit=8&user=true`);
        setter(res.data);
      } catch (err) {
        // Có thể xử lý lỗi ở đây
      }
    };
    fetchProducts('newest', setNewest);
    fetchProducts('best-selling', setBestSelling);
    fetchProducts('most-viewed', setMostViewed);
    fetchProducts('highest-discount', setHighestDiscount);
  }, []);

  const { Title } = Typography;

  const filterOptions = [
    { key: '', label: 'Tất cả sản phẩm' },
    { key: 'newest', label: 'Sản phẩm mới nhất', products: newest },
    { key: 'best-selling', label: 'Sản phẩm bán chạy nhất', products: bestSelling },
    { key: 'most-viewed', label: 'Sản phẩm được xem nhiều nhất', products: mostViewed },
    { key: 'highest-discount', label: 'Sản phẩm giảm giá cao nhất', products: highestDiscount },
  ];

  const renderProductSection = (title, products) => (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Title level={4} style={{ marginTop: 24 }}>{title}</Title>
      <Row gutter={[16, 16]}>
        {products.map(product => (
          <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
            <ProductCard
              id={product._id}
              title={product.title}
              thumbnail={product.thumbnail}
              brand={product.brand?.name}
              price={product.price}
              discountPercentage={product.discountPercentage}
            />
          </Col>
        ))}
      </Row>
      <Divider />
    </Space>
  );

  return (
    <>
      <Navbar isProductList={true} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 0' }}>
        <Space style={{ marginBottom: 24 }}>
          {filterOptions.map(option => (
            <button
              key={option.key}
              onClick={() => setSelectedFilter(option.key)}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: selectedFilter === option.key ? '2px solid #1677ff' : '1px solid #ccc',
                background: selectedFilter === option.key ? '#e6f4ff' : '#fff',
                color: selectedFilter === option.key ? '#1677ff' : '#333',
                fontWeight: selectedFilter === option.key ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {option.label}
            </button>
          ))}
        </Space>
        {selectedFilter === '' ? (
          <ProductList />
        ) : (
          filterOptions.map(option => (
            selectedFilter === option.key && option.key !== '' && renderProductSection(option.label, option.products)
          ))
        )}
      </div>
      <Footer />
    </>
  );
}
