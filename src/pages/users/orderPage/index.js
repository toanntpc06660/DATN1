import { memo, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './style.scss';
import { format } from 'date-fns';
import Breadcrumb from "pages/guests/theme/breadcrumb";
import Cookies from 'js-cookie';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [selectedTab, setSelectedTab] = useState(0); // Sử dụng index của tab

    useEffect(() => {
        // Mock data
        const mockOrders = [
            {
                id: 1,
                account: { fullname: 'Nguyễn Văn A' },
                phone: '0912345678',
                address: { ward: 'Phường 1', district: 'Quận 1', province: 'TP.HCM' },
                note: 'Giao hàng trước 5 giờ chiều',
                date: [2024, 8, 23, 14, 30],
                status: 1,
                payment: { method: 'cash' }
            },
            {
                id: 2,
                account: { fullname: 'Trần Thị B' },
                phone: '0987654321',
                address: { ward: 'Phường 2', district: 'Quận 3', province: 'TP.HCM' },
                note: '',
                date: [2024, 8, 22, 10, 0],
                status: 2,
                payment: { method: 'vnpay' }
            },
            // Thêm nhiều dữ liệu giả khác nếu cần
        ];

        const sortedOrders = mockOrders.sort((a, b) => {
            const dateA = new Date(a.date[0], a.date[1] - 1, a.date[2], a.date[3], a.date[4]);
            const dateB = new Date(b.date[0], b.date[1] - 1, b.date[2], b.date[3], b.date[4]);
            return dateB - dateA;
        });

        setOrders(sortedOrders);
        setLoading(false);
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 1:
                return <span className="badge badge-warning">Chờ Xử Lý</span>;
            case 2:
                return <span className="badge badge-info">Đã Xác Nhận</span>;
            case 3:
                return <span className="badge badge-primary">Đang Vận Chuyển</span>;
            case 4:
                return <span className="badge badge-success">Đã Giao Hàng</span>;
            case 5:
                return <span className="badge badge-danger">Đã Hủy</span>;
            default:
                return <span className="badge badge-secondary">Không xác định</span>;
        }
    };

    const formatDate = (dateArray) => {
        try {
            const [year, month, day, hour, minute] = dateArray;
            const parsedDate = new Date(year, month - 1, day, hour, minute);
            if (isNaN(parsedDate)) {
                throw new Error('Invalid date');
            }
            return format(parsedDate, 'dd/MM/yyyy HH:mm');
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'N/A';
        }
    };

    const handleCancelOrder = (orderId) => {
        confirmAlert({
            title: 'Xác Nhận Hủy Đơn',
            message: 'Bạn có chắc chắn muốn hủy đơn hàng này không?',
            buttons: [
                {
                    label: 'Có',
                    onClick: () => {
                        setOrders(prevOrders => prevOrders.map(order =>
                            order.id === orderId ? { ...order, status: 5 } : order
                        ));
                    }
                },
                {
                    label: 'Không',
                    onClick: () => { }
                }
            ]
        });
    };

    const filteredOrders = orders.filter(order => order.status === selectedTab + 1);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
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
            <Breadcrumb title="Đơn hàng" />
            <div className="container mt-5">
                <div className="order-page">
                    <h2>Quản Lý Đơn Hàng</h2>
                    <Tabs selectedIndex={selectedTab} onSelect={(index) => setSelectedTab(index)}>
                        <TabList>
                            <Tab>Chờ Xử Lý</Tab>
                            <Tab>Đã Xác Nhận</Tab>
                            <Tab>Đang Vận Chuyển</Tab>
                            <Tab>Đã Giao Hàng</Tab>
                            <Tab>Đã Hủy</Tab>
                        </TabList>

                        {[1, 2, 3, 4, 5].map(status => (
                            <TabPanel key={status}>
                                {filteredOrders.length === 0 ? (
                                    <div className="alert alert-info mt-3">Không có đơn hàng nào.</div>
                                ) : (
                                    <table className="table mt-3">
                                        <thead>
                                            <tr>
                                                <th>Họ tên</th>
                                                <th>Điện Thoại</th>
                                                <th>Địa Chỉ</th>
                                                <th>Ghi Chú</th>
                                                <th>Ngày Đặt</th>
                                                <th>Trạng Thái</th>
                                                <th>Thanh Toán</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOrders.map(order => (
                                                <tr key={order.id}>
                                                    <td>{order.account.fullname}</td>
                                                    <td>{order.phone}</td>
                                                    <td>{`${order.address.ward}, ${order.address.district}, ${order.address.province}`}</td>
                                                    <td>{order.note || 'Không có ghi chú'}</td>
                                                    <td>{formatDate(order.date)}</td>
                                                    <td>{getStatusBadge(order.status)}</td>
                                                    <td>{order.payment.method === 'cash' ? 'Tiền Mặt' : 'VNPay'}</td>
                                                    <td>
                                                        <Link to={`/myAcc/orderdetails/${order.id}`} className="btn btn-primary btn-sm mr-2">
                                                            Xem Chi Tiết
                                                        </Link>
                                                        {parseInt(order.status, 10) === 1 && (
                                                            <button
                                                                onClick={() => handleCancelOrder(order.id)}
                                                                className="btn btn-cancel"
                                                            >
                                                                Hủy Đơn
                                                            </button>
                                                        )}
                                                    </td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </TabPanel>
                        ))}
                    </Tabs>
                    <div className="pagination">
                        <button
                            className="btn btn-secondary"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            Trang Trước
                        </button>
                        <span className="current-page">{currentPage}</span>
                        <button
                            className="btn btn-secondary"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Trang Tiếp
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(OrderPage);
