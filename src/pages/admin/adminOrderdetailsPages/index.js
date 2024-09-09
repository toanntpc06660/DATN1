import React, { memo, useState, useEffect } from 'react';
import './style.scss';
import { useParams } from "react-router-dom";
import { AiFillDollarCircle, AiOutlineSafetyCertificate } from "react-icons/ai";
import axios from 'axios';

const AdminOrderdetailsPage = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!orderId) {
            setError("ID không hợp lệ");
            setLoading(false);
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/orderdetails/order/${orderId}`);
                setOrderDetails(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const getStatusBadge = (status) => {
        // Chuyển đổi status thành số nguyên nếu cần
        const statusInt = parseInt(status, 10);

        switch (statusInt) {
            case 1:
                return <span className="badge badge-warning">Chờ Xác Nhận</span>;
            case 2:
                return <span className="badge badge-info">Đã Xác Nhận</span>;
            case 3:
                return <span className="badge badge-primary">Đang Giao Hàng</span>;
            case 4:
                return <span className="badge badge-success">Đã Giao Hàng</span>;
            case 5:
                return <span className="badge badge-danger">Đã Hủy</span>;
            default:
                return <span className="badge badge-secondary">Không xác định</span>;
        }
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-5" role="alert">Lỗi: {error}</div>;
    }

    return (
        <>
            <div className="container">
            <h3 className="admin-orderdetails-title mt-3">Chi Tiết Đơn Hàng {orderId}</h3>
                <div className="table-responsive">
                    <table className="table table-bordered text-center mb-0">
                        <thead className="thead-dark">
                            <tr>
                                <th className="col-sm-3 text-center">Sản Phẩm</th>
                                <th className="col-sm-2 text-center">Hình Ảnh</th>
                                <th className="col-sm-2 text-center">Size</th>
                                <th className="col-sm-2 text-center">Giá</th>
                                <th className="col-sm-1 text-center">Số Lượng</th>
                                <th className="col-sm-2 text-center">Tạm Tính</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.length > 0 ? (
                                orderDetails.map((item) => (
                                    <tr key={item.id}>
                                        <td><b>{item.productdetails.product.name}</b></td>
                                        <td>
                                            <img alt={item.productdetails.product.name} src={`/featured/${item.productdetails.product.image}`} width="50px" />
                                        </td>
                                        <td>
                                            <p>{item.productdetails.product.sizes[0]?.name || 'Chưa có kích thước'}</p>
                                        </td>
                                        <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
                                        <td><b>{item.quantity}</b></td>
                                        <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="orderdetails-summary mt-4">
                    <div className="status-text">
                        <small>
                            <AiOutlineSafetyCertificate /> <b>Tình Trạng: {getStatusBadge(orderDetails[0]?.order?.status)}</b>
                        </small>
                    </div>
                    <div className="total-text mt-2">
                        <small>
                            <AiFillDollarCircle /> <b>Tổng Tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetails.reduce((total, item) => total + (item.price * item.quantity), 0))}</b>
                        </small>
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(AdminOrderdetailsPage);
