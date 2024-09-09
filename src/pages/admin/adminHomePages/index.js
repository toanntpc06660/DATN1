import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.scss';
import { FaHome, FaTag, FaBox, FaShoppingCart } from 'react-icons/fa';

const AdminHomePage = () => {
    const [categoryCount, setCategoryCount] = useState(0);
    const [productsCount, setProductsCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);
    const [totalDeliveredOrdersPrice, setTotalDeliveredOrdersPrice] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const categoryRes = await axios.get('http://localhost:8080/api/statistics/category-count');
                const productsRes = await axios.get('http://localhost:8080/api/statistics/products-count');
                const ordersRes = await axios.get('http://localhost:8080/api/statistics/orders-count');
                const priceRes = await axios.get('http://localhost:8080/api/statistics/revenue-from-delivered-orders');

                setCategoryCount(categoryRes.data);
                setProductsCount(productsRes.data);
                setOrdersCount(ordersRes.data);
                setTotalDeliveredOrdersPrice(parseFloat(priceRes.data) || 0); // Chuyển đổi dữ liệu thành số
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setError(error.message);
            }
        };

        fetchStatistics();
    }, []);

    return (
        <>
            <header className="admin-header">
                <div className="header-container">
                    <h1>Quản Trị Hệ Thống</h1>
                    <nav>
                        <ul>
                            <li><a href="/"><FaHome className="header-icon" /> Trang Chủ</a></li>
                            <li><a href="/admin/category"><FaTag className="header-icon" /> Quản Lý Thể Loại</a></li>
                            <li><a href="/admin/products"><FaBox className="header-icon" /> Quản Lý Sản Phẩm</a></li>
                            <li><a href="/admin/orders"><FaShoppingCart className="header-icon" /> Xem Đơn Hàng</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="admin-home">
                <section className="admin-stats">
                    <div className="stat-card">
                        <FaTag className="stat-icon" />
                        <h2>Thể Loại</h2>
                        <p>{categoryCount}</p>
                    </div>
                    <div className="stat-card">
                        <FaBox className="stat-icon" />
                        <h2>Sản Phẩm</h2>
                        <p>{productsCount}</p>
                    </div>
                    <div className="stat-card">
                        <FaShoppingCart className="stat-icon" />
                        <h2>Đơn Hàng</h2>
                        <p>{ordersCount}</p>
                    </div>
                </section>

                <section className="admin-table">
                    <h2>Bảng Thống Kê</h2>
                    {error ? (
                        <p className="error-message">Có lỗi xảy ra: {error}</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Hạng Mục</th>
                                    <th>Số Lượng</th>
                                    <th>Tổng Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Thể Loại</td>
                                    <td>{categoryCount}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Sản Phẩm</td>
                                    <td>{productsCount}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Đơn Hàng</td>
                                    <td>{ordersCount}</td>
                                    <td>${typeof totalDeliveredOrdersPrice === 'number' ? totalDeliveredOrdersPrice.toFixed(2) : '0.00'}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </section>
            </main>

            <footer className="admin-footer">
                <div className="footer-container">
                    <p>&copy; 2024 Quản Trị Hệ Thống. Tất cả các quyền được bảo lưu.</p>
                </div>
            </footer>
        </>
    );
};

export default AdminHomePage;
