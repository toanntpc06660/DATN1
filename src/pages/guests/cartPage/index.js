import { memo, useState, useEffect, useCallback } from "react";
import axios from "axios";
import Breadcrumb from "../theme/breadcrumb";
import formatNumber from 'format-number'; // Thư viện định dạng số
import "./style.scss";
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import confirmAlert từ react-confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS của react-confirm-alert
import Cookies from 'js-cookie'; // Import js-cookie để lấy cookies

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Thêm state để kiểm tra đăng nhập
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    // Lấy thông tin người dùng từ cookies
    const getUserIdFromCookies = () => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            const userData = JSON.parse(userCookie);
            return userData.id; // Trả về ID người dùng
        }
        return null; // Không tìm thấy người dùng
    };

    // Fetch giỏ hàng
    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const accountId = getUserIdFromCookies();
            if (!accountId) {
                setIsLoggedIn(false); // Nếu không có accountId, set isLoggedIn là false
                return;
            }

            const cartResponse = await axios.get(`http://localhost:8080/api/cartdetails?accountId=${accountId}`);
            // console.log('Cart response:', cartResponse.data);

            if (cartResponse.status === 200) {
                setCartItems(cartResponse.data);
            } else {
                setError('Có lỗi xảy ra khi tải giỏ hàng.');
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi tải giỏ hàng.');
            // console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    // Xử lý xóa sản phẩm
    const handleRemoveItem = useCallback((id) => {
        confirmAlert({
            title: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
            buttons: [
                {
                    label: 'Có',
                    onClick: async () => {
                        try {
                            await axios.delete(`http://localhost:8080/api/cartdetails/${id}`);
                            setCartItems(prevItems =>
                                prevItems.filter(item => item.id !== id)
                            );
                        } catch (error) {
                            console.error('Error removing item:', error);
                        }
                    }
                },
                {
                    label: 'Không'
                }
            ]
        });
    }, []);

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    const updateCartItem = async (id, quantity) => {
        try {
            await axios.put(`http://localhost:8080/api/cartdetails/${id}`, { quantity });
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    // Xử lý thay đổi số lượng sản phẩm
    const handleQuantityChange = useCallback(async (id, event) => {
        const value = parseInt(event.target.value);
        if (!isNaN(value) && value > 0) {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === id ? { ...item, quantity: value } : item
                )
            );
            await updateCartItem(id, value);
        }
    }, []);

    // Tăng số lượng sản phẩm
    const incrementQuantity = useCallback(async (id) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.id === id
                    ? { ...item, quantity: (parseInt(item.quantity, 10) || 0) + 1 }
                    : item
            );
            // Gửi yêu cầu PUT sau khi cập nhật số lượng trong trạng thái
            const updatedItem = updatedItems.find(item => item.id === id);
            if (updatedItem) {
                updateCartItem(id, updatedItem.quantity);
            }
            return updatedItems;
        });
    }, []);

    // Giảm số lượng sản phẩm
    const decrementQuantity = useCallback(async (id) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max((parseInt(item.quantity, 10) || 1) - 1, 1) }
                    : item
            );
            // Gửi yêu cầu PUT sau khi cập nhật số lượng trong trạng thái
            const updatedItem = updatedItems.find(item => item.id === id);
            if (updatedItem) {
                updateCartItem(id, updatedItem.quantity);
            }
            return updatedItems;
        });
    }, []);

    // Xử lý thay đổi kích thước
    const handleSizeChange = useCallback((id, event) => {
        setSelectedSize(prevSizes => ({
            ...prevSizes,
            [id]: event.target.value
        }));
    }, []);

    // Tính tổng số tiền
    const calculateTotal = useCallback(() => {
        return cartItems
            .filter(item => item.isSelected)
            .reduce((total, item) => {
                const itemPrice = parseFloat(item.productDetails?.product?.price?.replace(/[^\d.-]/g, '') || '0');
                return total + (itemPrice * (item.quantity || 1));
            }, 0);
    }, [cartItems]);

    // Tính tổng số lượng sản phẩm
    const calculateTotalQuantity = useCallback(() => {
        return cartItems
            .filter(item => item.isSelected)
            .reduce((total, item) => {
                const quantity = parseInt(item.quantity, 10);
                return total + (isNaN(quantity) ? 0 : quantity);
            }, 0);
    }, [cartItems]);

    // Định dạng số lượng
    const formatQuantity = (quantity) => {
        return quantity.toString(); // Chỉ đơn giản chuyển số thành chuỗi
    };

    // Định dạng tiền
    const formatCurrency = formatNumber({
        prefix: '',
        suffix: ' đ',
    });

    // Xử lý thay đổi trạng thái checkbox
    const handleCheckboxChange = useCallback((id) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, isSelected: !item.isSelected } : item
            )
        );
    }, []);

    // Xử lý thanh toán
    const handleCheckout = useCallback(() => {
        if (!isLoggedIn) {
            // Nếu người dùng chưa đăng nhập, hiển thị thông báo và chuyển hướng đến trang đăng nhập
            confirmAlert({
                title: 'Thông báo',
                message: 'Bạn cần đăng nhập để thực hiện thanh toán. Bạn có muốn đăng nhập không?',
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => navigate('/login') // Điều hướng đến trang đăng nhập
                    }
                ]
            });
            return;
        }

        // Lọc các sản phẩm được chọn
        const selectedItems = cartItems.filter(item => item.isSelected);

        // Nếu có sản phẩm được chọn
        if (selectedItems.length > 0) {
            // Lấy danh sách ID của các sản phẩm được chọn và chuyển thành chuỗi phân cách bằng dấu phẩy
            const selectedItemIds = selectedItems.map(item => item.id).join(',');

            // Di chuyển đến trang thanh toán với chuỗi ID sản phẩm
            navigate(`/cart/checkout?items=${encodeURIComponent(selectedItemIds)}`, { state: { selectedItems } });
        } else {
            confirmAlert({
                title: 'Cảnh báo',
                message: 'Vui lòng chọn ít nhất một sản phẩm để thanh toán.',
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => { }
                    }
                ]
            });
        }
    }, [cartItems, isLoggedIn, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!isLoggedIn) {
        return (
            <div className="container">
                <div className="login-warning">
                    <h2>Chưa đăng nhập</h2>
                    <p className="ppppp">Bạn cần đăng nhập để xem giỏ hàng.</p>
                    <button className="btn-login-warning" onClick={() => navigate('/signin')}>ĐĂNG NHẬP NGAY</button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Breadcrumb name="Giỏ hàng" />
            <div className="container">
                <div className="row">
                    <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12">
                        <div className="cart-box">
                            <div className="cart-header">
                                <h2 className="title">Giỏ hàng của bạn</h2>
                                <button
                                    className="btn-checkout"
                                    onClick={handleCheckout}
                                    disabled={cartItems.length === 0}
                                >
                                    Thanh toán
                                </button>
                            </div>
                            <div className="cart-body">
                                {cartItems.length === 0 ? (
                                    <p>Giỏ hàng của bạn đang trống</p>
                                ) : (
                                    <table className="table table-cart">
                                        <thead>
                                            <tr>
                                                <th>Chọn</th>
                                                <th>Sản phẩm</th>
                                                <th>Kích thước</th>
                                                <th>Số lượng</th>
                                                <th>Giá</th>
                                                <th>Tổng</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map((item) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={item.isSelected || false}
                                                            onChange={() => handleCheckboxChange(item.id)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <img src={item.productDetails?.product?.image || 'default-image.jpg'} alt={item.productDetails?.product?.name} />
                                                        <span>{item.productDetails?.product?.name}</span>
                                                    </td>
                                                    <td>
                                                        <select
                                                            value={selectedSize[item.id] || item.productDetails?.size}
                                                            onChange={(e) => handleSizeChange(item.id, e)}
                                                        >
                                                            {item.productDetails?.sizes?.map((size) => (
                                                                <option key={size} value={size}>
                                                                    {size}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <button onClick={() => decrementQuantity(item.id)}>-</button>
                                                        <input
                                                            type="number"
                                                            value={formatQuantity(item.quantity)}
                                                            onChange={(e) => handleQuantityChange(item.id, e)}
                                                            min="1"
                                                        />
                                                        <button onClick={() => incrementQuantity(item.id)}>+</button>
                                                    </td>
                                                    <td>{formatCurrency(item.productDetails?.product?.price || 0)}</td>
                                                    <td>{formatCurrency((item.productDetails?.product?.price || 0) * (item.quantity || 1))}</td>
                                                    <td>
                                                        <button onClick={() => handleRemoveItem(item.id)}>Xóa</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="6">
                                                    <h3 className="total">Tổng cộng: {formatCurrency(calculateTotal())}</h3>
                                                    <h4 className="quantity">Số lượng sản phẩm: {calculateTotalQuantity()}</h4>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(CartPage);
