import { ROUTERS } from "utils/router";
import { memo, useState, useEffect } from "react";
import './style.scss';
import { Link, useParams } from "react-router-dom"; 
import Breadcrumb from "pages/guests/theme/breadcrumb";
import { FaBox, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaTruck } from "react-icons/fa";

const OrderDetailsPage = () => {
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

        // Dữ liệu giả
        const mockOrderDetails = [
            {
                id: 1,
                productdetails: {
                    product: {
                        name: 'Áo Thun Nam',
                        image: 'ao5.jpg',
                        sizes: [{ name: 'M' }]
                    }
                },
                price: 150000,
                quantity: 2,
                order: {
                    status: 5 // Confirmed
                }
            },
            {
                id: 2,
                productdetails: {
                    product: {
                        name: 'Quần Jeans',
                        image: 'ao4.jpg',
                        sizes: [{ name: 'L' }]
                    }
                },
                price: 250000,
                quantity: 1,
                order: {
                    status: 4 // Delivered
                }
            }
        ];

        setTimeout(() => {
            setOrderDetails(mockOrderDetails);
            setLoading(false);
        }, 1000);

    }, [orderId]);

    const getStatusDetails = (status) => {
        const statusInt = parseInt(status, 10);

        switch (statusInt) {
            case 1:
                return {
                    icon: <FaHourglassHalf className="status-icon status-pending" />,
                    text: "Chờ xử lý"
                };
            case 2:
                return {
                    icon: <FaCheckCircle className="status-icon status-confirmed" />,
                    text: "Đã xác nhận"
                };
            case 3:
                return {
                    icon: <FaTruck className="status-icon status-shipping" />,
                    text: "Đang vận chuyển"
                };
            case 4:
                return {
                    icon: <FaBox className="status-icon status-delivered" />,
                    text: "Đã giao hàng"
                };
            case 5:
                return {
                    icon: <FaTimesCircle className="status-icon status-canceled" />,
                    text: "Đã hủy"
                };
            default:
                return {
                    icon: <FaHourglassHalf className="status-icon status-unknown" />,
                    text: "Không xác định"
                };
        }
    };

    // Lấy trạng thái từ đơn hàng đầu tiên trong orderDetails
    const orderStatus = orderDetails.length > 0 ? orderDetails[0].order.status : 0;
    const { icon, text } = getStatusDetails(orderStatus);

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-5" role="alert">Lỗi: {error}</div>;
    }

    return (
        <>
            <Breadcrumb name="Đơn hàng chi tiết" />
            <div className="container">
                <h3 className="mt-3">
                    <Link to={ROUTERS.USER.ORDER} className="btn btn-link">
                        <i className="fas fa-arrow-left"></i>
                    </Link>
                </h3>
                <div className="bill-container mt-4">
                    <div className="bill-header">
                        <h2 className="bill-title">HÓA ĐƠN</h2>
                        <p className="bill-id">Mã Đơn Hàng: <strong>{orderId}</strong></p>
                        <p className="bill-date">Thời gian đặt hàng: <strong>{new Date().toLocaleDateString()}</strong></p>
                        <p className="bill-id">Địa chỉ nhận hàng: <strong>abc</strong></p>
                        <p className="bill-id">Họ tên: <strong>abc</strong></p>
                        <p className="bill-id">Số điện thoại: <strong>abc</strong></p>
                        <br/>
                        <h2 className="bill-title">THÀNH TIỀN:   <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetails.reduce((total, item) => total + (item.price * item.quantity), 0))}</strong></h2>
                        <p className="bill-id">vui lòng thanh toán <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetails.reduce((total, item) => total + (item.price * item.quantity), 0))}</strong> khi nhận hàng</p>
                        <br/>
                        <h2 className="bill-title">PHƯƠNG THỨC THANH TOÁN</h2>
                        <p className="bill-id">Thanh toán khi nhận hàng</p>
                    </div>
                    <div className="bill-footer">
                        <div className="status-container">
                            <div className={`status-item ${orderStatus === 1 ? 'active' : 'completed'}`}>
                                <div className="status-icon"><FaHourglassHalf /></div>
                                <span className="status-text">Chờ Xử Lý</span>
                            </div>
                            <div className={`status-divider ${orderStatus === 1 ? 'active' : ''}`}></div>
                            <div className={`status-item ${orderStatus === 2 ? 'active' : (orderStatus > 2 ? 'completed' : '')}`}>
                                <div className="status-icon"><FaCheckCircle /></div>
                                <span className="status-text">Đã Xác Nhận</span>
                            </div>
                            <div className={`status-divider ${orderStatus === 2 ? 'active' : ''}`}></div>
                            <div className={`status-item ${orderStatus === 3 ? 'active' : (orderStatus > 3 ? 'completed' : '')}`}>
                                <div className="status-icon"><FaTruck /></div>
                                <span className="status-text">Đang Vận Chuyển</span>
                            </div>
                            <div className={`status-divider ${orderStatus === 3 ? 'active' : ''}`}></div>
                            <div className={`status-item ${orderStatus === 4 ? 'active' : (orderStatus === 5 ? 'completed' : '')}`}>
                                <div className="status-icon"><FaBox /></div>
                                <span className="status-text">Đã Giao Hàng</span>
                            </div>
                            <div className={`status-divider ${orderStatus === 4 ? 'active' : ''}`}></div>
                            <div className={`status-item ${orderStatus === 5 ? 'active' : ''}`}>
                                <div className="status-icon"><FaTimesCircle /></div>
                                <span className="status-text">Đã Hủy</span>
                            </div>
                        </div>
                    </div>
                    <div className="bill-body">
                        {orderDetails.length > 0 ? (
                            <div className="order-items-container">
                                {orderDetails.map((item) => (
                                    <div className="order-item" key={item.id}>
                                        <img
                                            alt={item.productdetails.product.name}
                                            src={`../../featured/${item.productdetails.product.image}`}
                                            className="product-image"
                                        />
                                        <div className="item-details">
                                            <h5 className="product-name">{item.productdetails.product.name}</h5>
                                            <p className="product-size">Size: {item.productdetails.product.sizes[0]?.name || 'Chưa có kích thước'}</p>
                                            <p className="product-price">Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</p>
                                            <p className="product-quantity">Số lượng: <b>{item.quantity}</b></p>
                                            <p className="product-total">Tạm tính: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-data">Không có dữ liệu</div>
                        )}
                    </div>
                    
                </div>
            </div>
        </>
    );
};

export default memo(OrderDetailsPage);
