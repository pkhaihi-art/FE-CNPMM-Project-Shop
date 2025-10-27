import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { selectLoggedInUser } from './features/auth/AuthSlice';
import { selectCartItemAddStatus, fetchCartByUserIdAsync } from './features/cart/CartSlice';
import { selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, fetchWishlistByUserIdAsync } from './features/wishlist/WishlistSlice';
import { Logout } from './features/auth/components/Logout';
import { Protected } from './features/auth/components/Protected';
import { useAuthCheck } from "./hooks/useAuth/useAuthCheck";
import { useFetchLoggedInUserDetails } from "./hooks/useAuth/useFetchLoggedInUserDetails";
import { AddProductPage, AdminOrdersPage, CartPage, CheckoutPage, ForgotPasswordPage, HomePage, LoginPage, OrderSuccessPage, ProductDetailsPage, ProductUpdatePage, ResetPasswordPage, SignupPage, UserOrdersPage, UserProfilePage, WishlistPage } from './pages';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import {AdminBrandPage} from "./pages/AdminBrandPage";
import {AdminUserPage} from "./pages/AdminUserPage";

function App() {
  const loggedInUser = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();

  // Initialize auth check
  useAuthCheck();
  useFetchLoggedInUserDetails(loggedInUser);

  // Handle cart and wishlist updates
  const cartItemAddStatus = useSelector(selectCartItemAddStatus);
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);

  React.useEffect(() => {
    if (cartItemAddStatus === 'fulfilled' && loggedInUser?._id) {
      dispatch(fetchCartByUserIdAsync(loggedInUser._id));
    }
  }, [cartItemAddStatus, loggedInUser?._id, dispatch]);

  React.useEffect(() => {
    if ((wishlistItemAddStatus === 'fulfilled' || wishlistItemDeleteStatus === 'fulfilled') && loggedInUser?._id) {
      dispatch(fetchWishlistByUserIdAsync(loggedInUser._id));
    }
  }, [wishlistItemAddStatus, wishlistItemDeleteStatus, loggedInUser?._id, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password/:userId/:passwordResetToken' element={<ResetPasswordPage />} />
        
        {/* Protected routes */}
        <Route path='/logout' element={<Protected><Logout /></Protected>} />
        <Route path='/product-details/:id' element={<Protected><ProductDetailsPage /></Protected>} />

        {/* Admin routes */}
        {loggedInUser?.isAdmin ? (
          <>
            <Route path='/admin/dashboard' element={<Protected><AdminDashboardPage /></Protected>} />
            <Route path='/admin/product-update/:id' element={<Protected><ProductUpdatePage /></Protected>} />
            <Route path='/admin/add-product' element={<Protected><AddProductPage /></Protected>} />
            <Route path='/admin/orders' element={<Protected><AdminOrdersPage /></Protected>} />
            <Route path='/admin/brand' element={<Protected><AdminBrandPage /></Protected>} />
            <Route path="/admin/user" element={<Protected><AdminUserPage /></Protected>} />
            <Route path='*' element={<Navigate to='/admin/dashboard' />} />
          </>
        ) : (
          <>
            {/* User routes */}
            <Route path='/' element={<Protected><HomePage /></Protected>} />
            <Route path='/cart' element={<Protected><CartPage /></Protected>} />
            <Route path='/profile' element={<Protected><UserProfilePage /></Protected>} />
            <Route path='/checkout' element={<Protected><CheckoutPage /></Protected>} />
            <Route path='/order-success/:id' element={<Protected><OrderSuccessPage /></Protected>} />
            <Route path='/orders' element={<Protected><UserOrdersPage /></Protected>} />
            <Route path='/wishlist' element={<Protected><WishlistPage /></Protected>} />
            <Route path='*' element={<NotFoundPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
