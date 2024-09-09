import { memo, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.scss';
import { format } from 'date-fns';
import { confirmAlert } from 'react-confirm-alert'; // Import confirmAlert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [provinceData, setProvinceData] = useState([]);
    const [districtData, setDistrictData] = useState(new Map());
    const [wardData, setWardData] = useState(new Map());

    useEffect(() => {
        // Tải dữ liệu tỉnh thành
        axios.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
            .then(response => {
                const data = response.data;
                setProvinceData(data);

                const districtsMap = new Map();
                const wardsMap = new Map();

                data.forEach(province => {
                    province.Districts.forEach(district => {
                        districtsMap.set(district.Id, district.Name);
                        district.Wards.forEach(ward => {
                            wardsMap.set(ward.Id, ward.Name);
                        });
                    });
                });

                setDistrictData(districtsMap);
                setWardData(wardsMap);
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu tỉnh thành:', error);
                setError('Lỗi khi lấy dữ liệu tỉnh thành');
            });

        // Lấy tất cả đơn hàng
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/orders');
                // Sắp xếp đơn hàng theo ngày và giờ tạo mới nhất
                const sortedOrders = response.data.sort((a, b) => {
                    const dateA = new Date(a.date[0], a.date[1] - 1, a.date[2], a.date[3], a.date[4]);
                    const dateB = new Date(b.date[0], b.date[1] - 1, b.date[2], b.date[3], b.date[4]);
                    return dateB - dateA; // Sắp xếp theo thứ tự giảm dần
                });
                setOrders(sortedOrders);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusBadge = (status) => {
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

    const statusOrderLevels = [1, 2, 3, 4, 5]; // Trạng thái theo thứ tự

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        const currentOrder = orders.find(order => order.id === orderId);
        const currentStatus = parseInt(currentOrder.status, 10);
        const newStatusInt = parseInt(newStatus, 10);

        // Ngăn không cho hủy đơn hàng khi đã giao hàng
        if (currentStatus === 4 && newStatusInt === 5) {
            confirmAlert({
                title: 'Thông Báo',
                message: 'Đơn hàng đã giao không thể hủy.',
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => {}
                    }
                ]
            });
            return;
        }

        // Kiểm tra xem trạng thái mới có hợp lệ hay không (chỉ tăng 1 cấp)
        const currentIndex = statusOrderLevels.indexOf(currentStatus);
        const newIndex = statusOrderLevels.indexOf(newStatusInt);

        if (newIndex <= currentIndex || newIndex > currentIndex + 1) {
            confirmAlert({
                title: 'Thông Báo',
                message: 'Chỉ được phép cập nhật trạng thái lên 1 cấp.',
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => {}
                    }
                ]
            });
            return;
        }

        // Hiển thị hộp thoại xác nhận
        confirmAlert({
            title: 'Xác Nhận Thay Đổi',
            message: 'Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng này không?',
            buttons: [
                {
                    label: 'Có',
                    onClick: async () => {
                        try {
                            await axios.put(`http://localhost:8080/api/orders/${orderId}/status`, { status: newStatus });
                            // Cập nhật trạng thái đơn hàng trong giao diện người dùng
                            setOrders(orders.map(order => 
                                order.id === orderId ? { ...order, status: newStatus } : order
                            ));
                        } catch (error) {
                            console.error('Error updating order status:', error);
                            confirmAlert({
                                title: 'Lỗi',
                                message: 'Lỗi khi cập nhật trạng thái đơn hàng',
                                buttons: [
                                    {
                                        label: 'OK',
                                        onClick: () => {}
                                    }
                                ]
                            });
                        }
                    }
                },
                {
                    label: 'Không',
                    onClick: () => {}
                }
            ]
        });
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-5" role="alert">Lỗi: {error}</div>;
    }

    return (
        <>
            <div className="container mt-5">
                <h1 className="mb-4">
                    <small>Lịch Sử Order</small>
                </h1>
                <hr className="my-4" />
                <div className="table-responsive">
                    {orders.length === 0 ? (
                        <div className="alert alert-info mt-4" role="alert">
                            Không có đơn hàng nào
                        </div>
                    ) : (
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Họ Tên</th>
                                    <th scope="col">Số Điện Thoại</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col">Ghi chú</th>
                                    <th scope="col">Ngày Đặt</th>
                                    <th scope="col">Phương thức</th>
                                    <th scope="col">Trạng Thái</th>
                                    <th scope="col">Cập Nhật Trạng Thái</th>
                                    <th scope="col">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => {
                                    const provinceName = provinceData.find(p => p.Id === order.province)?.Name || 'Không xác định';
                                    const districtName = districtData.get(order.district) || 'Không xác định';
                                    const wardName = wardData.get(order.ward) || 'Không xác định';

                                    return (
                                        <tr key={order.id}>
                                            <td>{order.account.fullname}</td>
                                            <td>{order.phone}</td>
                                            <td>
                                                {`${provinceName} - ${districtName} - ${wardName}`}
                                            </td>
                                            <td>{order.note}</td>
                                            <td>{formatDate(order.date)}</td>
                                            <td>{order.payment.method}</td>
                                            <td>{getStatusBadge(order.status)}</td>
                                            <td>
                                                {parseInt(order.status, 10) === 4 || parseInt(order.status, 10) === 5 ? (
                                                    <span className="text-muted">Không thể cập nhật</span>
                                                ) : (
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                        className="form-control"
                                                    >
                                                        <option value="1">Chờ Xác Nhận</option>
                                                        <option value="2">Đã Xác Nhận</option>
                                                        <option value="3">Đang Giao Hàng</option>
                                                        <option value="4">Đã Giao Hàng</option>
                                                        <option value="5">Đã Hủy</option>
                                                    </select>
                                                )}
                                            </td>
                                            <td>
                                                <Link to={`/admin/orders/details/${order.id}`} className="btn btn-primary btn-sm">
                                                    Chi Tiết
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default memo(OrderPage);
