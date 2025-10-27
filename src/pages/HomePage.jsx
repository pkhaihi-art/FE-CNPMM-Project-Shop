import { Navbar } from '../features/navigation/components/Navbar';
// ProductCard đã bị xóa vì không còn dùng trong UI
import { ProductList } from '../features/products/components/ProductList';
import { Footer } from '../features/footer/Footer';
// Các import của Ant Design không còn dùng đã bị xóa (Row, Col, Typography, Space, Divider)


export const HomePage = () => {

  return (
    <>
      <Navbar isProductList={true} />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 0' }}>
        <ProductList />
      </div>
      <Footer />
    </>
  );
}