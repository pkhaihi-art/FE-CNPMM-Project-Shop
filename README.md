# Tech Shop - Frontend

Dự án frontend cho website thương mại điện tử Tech Shop, được xây dựng bằng React và các thư viện hiện đại.

## Công nghệ sử dụng

- React 
- Redux Toolkit - Quản lý state
- Ant Design - UI Components
- React Router - Routing
- i18next - Đa ngôn ngữ
- Axios - HTTP Client
- Framer Motion - Animation

## Tính năng chính

- Đăng nhập/Đăng ký tài khoản
- Xem danh sách sản phẩm 
- Tìm kiếm, lọc sản phẩm
- Quản lý giỏ hàng
- Thanh toán đơn hàng
- Quản lý danh sách yêu thích
- Đánh giá sản phẩm
- Quản lý thông tin cá nhân
- Xem lịch sử đơn hàng
- Giao diện Admin (quản lý sản phẩm, đơn hàng, người dùng)

## Cài đặt

```bash
# Clone repository
git clone https://github.com/pkhaihi-art/FE-CNPMM-Project-Shop.git

# Di chuyển vào thư mục
cd FE-CNPMM-Project-Shop

# Cài đặt dependencies
npm install

# Chạy ở môi trường development
npm run dev

# Build cho production
npm run build
```

## Cấu trúc thư mục

```
src/
├── app/            # Redux store setup
├── assets/         # Static assets
├── components/     # Shared components
├── config/         # Configuration files
├── constants/      # Constants and enums
├── features/       # Feature modules
├── hooks/          # Custom hooks
├── layout/         # Layout components
├── locales/        # i18n translations
├── pages/          # Page components
└── theme/          # Theme configuration
```

## Tác giả

- pkhaihi-art

## License

MIT License