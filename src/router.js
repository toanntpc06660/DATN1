import React from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import HomePage from './pages/guests/homePage';
import { ROUTERS } from './utils/router';
import MasterLayout from './pages/guests/theme/masterLayout';
import ProfilePage from './pages/users/profilePage';
import ProductsPage from './pages/guests/productsPage';
import ProductdetailsPage from './pages/guests/productdetailsPage';
import CartPage from './pages/guests/cartPage';
import SignInPage from './pages/guests/signInPage';
import SignUpPage from './pages/guests/signUpPage';
import ForgotPasswordPage from './pages/guests/forgotPasswordPage';
import ContactPage from './pages/guests/contactPage';
import CheckoutPage from './pages/users/checkoutPage';
import OrderPage from './pages/users/orderPage';
import OrderDetailsPage from './pages/users/orderDetailsPage';
import AdminProductsPages from './pages/admin/adminProductsPages';
import AdminHomePages from './pages/admin/adminHomePages';
import Layout from './pages/admin/theme/layout/AdminLayout';
import AdminCategoryPages from './pages/admin/adminCategoryPages';
import AdminOrdersPages from './pages/admin/adminOrdersPages';
import AdminOrderdetailsPages from './pages/admin/adminOrderdetailsPages';
import AdminUsersPages from './pages/admin/adminUsersPages';
import AdminProductSizePages from './pages/admin/adminProductSizePages';
import FavouritePage from './pages/guests/favouritePage';

const UserRoutes = () => (
    <MasterLayout>
        <Routes>
            <Route path={ROUTERS.GUEST.HOME} element={<HomePage />} />
            <Route path={ROUTERS.USER.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTERS.GUEST.PRODUCTS} element={<ProductsPage />} />
            <Route path={ROUTERS.GUEST.PRODUCTDETAILS} element={<ProductdetailsPage />} />
            <Route path={ROUTERS.GUEST.CART} element={<CartPage />} />
            <Route path={ROUTERS.GUEST.FAVOURITE} element={<FavouritePage />} />
            <Route path={ROUTERS.GUEST.SIGNIN} element={<SignInPage />} />
            <Route path={ROUTERS.GUEST.SIGNUP} element={<SignUpPage />} />
            <Route path={ROUTERS.GUEST.FORGOTPASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTERS.GUEST.CONTACT} element={<ContactPage />} />
            <Route path={ROUTERS.USER.CHECKOUT} element={<CheckoutPage />} />
            <Route path={ROUTERS.USER.ORDER} element={<OrderPage />} />
            <Route path={ROUTERS.USER.ORDERDETAILS} element={<OrderDetailsPage />} />
        </Routes>
    </MasterLayout>
);

const AdminRoutes = () => (
    <Layout>
        <Routes>
            <Route path={ROUTERS.ADMIN.PRODUCTS} element={<AdminProductsPages />} />
            <Route path={ROUTERS.ADMIN.USERS} element={<AdminUsersPages />} />
            <Route path={ROUTERS.ADMIN.HOME} element={<AdminHomePages />} />
            <Route path={ROUTERS.ADMIN.CATEGORY} element={<AdminCategoryPages />} />
            <Route path={ROUTERS.ADMIN.ORDERS} element={<AdminOrdersPages />} />
            <Route path={ROUTERS.ADMIN.ORDERDETAILS} element={<AdminOrderdetailsPages />} />
            <Route path={ROUTERS.ADMIN.PRODUCTSIZE} element={<AdminProductSizePages />} />
            {/* Thêm các route khác cho admin ở đây */}
        </Routes>
    </Layout>
);

const RouterCustom = () => {
    const location = useLocation();
    const token = Cookies.get('token'); // Giả sử token được lưu trong cookie với tên 'token'
    const userRole = token ? jwtDecode(token).roles : null;

    const isAdminPath = location.pathname.startsWith('/admin');

    if (isAdminPath && (!userRole || !userRole.includes('ADMIN'))) {
        // Nếu đường dẫn là /admin và vai trò không phải admin, chuyển hướng đến trang chính
        return <Navigate to={ROUTERS.GUEST.HOME} />;
    }

    return isAdminPath ? <AdminRoutes /> : <UserRoutes />;
};

export default RouterCustom;
