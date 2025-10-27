import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Spin, Empty, Card } from 'antd';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { searchProductsAsync, selectSearchResults, selectProductSearchStatus, clearSearchResults } from '../ProductSlice';

const { Search } = Input;

export const SearchBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    
    const searchResults = useSelector(selectSearchResults);
    const searchStatus = useSelector(selectProductSearchStatus);

    // Debounce search
    useEffect(() => {
        if (searchQuery.trim() === '') {
            dispatch(clearSearchResults());
            setShowResults(false);
            return;
        }

        const timer = setTimeout(() => {
            dispatch(searchProductsAsync(searchQuery));
            setShowResults(true);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, dispatch]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
        setSearchQuery('');
        setShowResults(false);
        dispatch(clearSearchResults());
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const calculateDiscountedPrice = (price, discount) => {
        return price - (price * discount / 100);
    };

    return (
        <div ref={searchRef} style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <Search
                placeholder="Tìm kiếm sản phẩm..."
                size="large"
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
                allowClear
                style={{ width: '100%' }}
            />

            {showResults && (
                <Card
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '8px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        zIndex: 1000,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                    bodyStyle={{ padding: '8px' }}
                >
                    {searchStatus === 'pending' && (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        </div>
                    )}

                    {searchStatus === 'fulfilled' && searchResults.length === 0 && (
                        <Empty
                            description="Không tìm thấy sản phẩm"
                            style={{ padding: '20px' }}
                        />
                    )}

                    {searchStatus === 'fulfilled' && searchResults.length > 0 && (
                        <div>
                            {searchResults.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => handleProductClick(product.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '12px',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        transition: 'background 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                            marginRight: '12px'
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ 
                                            fontWeight: 500, 
                                            marginBottom: '4px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {product.title}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {product.discountPercentage > 0 ? (
                                                <>
                                                    <span style={{ 
                                                        color: '#ff4d4f', 
                                                        fontWeight: 600 
                                                    }}>
                                                        {formatPrice(calculateDiscountedPrice(product.price, product.discountPercentage))}
                                                    </span>
                                                    <span style={{ 
                                                        textDecoration: 'line-through', 
                                                        color: '#999',
                                                        fontSize: '12px'
                                                    }}>
                                                        {formatPrice(product.price)}
                                                    </span>
                                                    <span style={{
                                                        background: '#ff4d4f',
                                                        color: 'white',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        fontSize: '11px',
                                                        fontWeight: 600
                                                    }}>
                                                        -{product.discountPercentage}%
                                                    </span>
                                                </>
                                            ) : (
                                                <span style={{ fontWeight: 600 }}>
                                                    {formatPrice(product.price)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};