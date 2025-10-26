import React, { useState } from 'react';
import { Carousel } from 'antd';
import './ProductBanner.css';

export const ProductBanner = ({ images }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleChange = (current) => {
    setActiveStep(current);
  };

  return (
    <div className="product-banner">
      <Carousel
        autoplay
        dots
        afterChange={handleChange}
        style={{ width: '100%', height: '100%' }}
      >
        {images.map((image, index) => (
          <div key={index} className="banner-slide">
            <img
              src={image}
              alt={`Banner ${index}`}
              className="banner-image"
            />
          </div>
        ))}
      </Carousel>

      {/* Hiển thị chỉ số (nếu bạn muốn thay thế MobileStepper) */}
      <div className="banner-stepper">
        {activeStep + 1} / {images.length}
      </div>
    </div>
  );
};
