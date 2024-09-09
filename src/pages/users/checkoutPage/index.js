import { memo, useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';
import './style.scss';
import { useLocation, useNavigate } from 'react-router-dom'; 
import Breadcrumb from 'pages/guests/theme/breadcrumb';
import Cookies from 'js-cookie'; // Import js-cookie
import { confirmAlert } from 'react-confirm-alert';
import { ROUTERS } from 'utils/router';

const CheckOutPage = () => {
    const [province, setProvince] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [addressDetail, setAddressDetail] = useState('');
    const [error, setError] = useState('');

    const location = useLocation();
    const navigate = useNavigate(); 

    const cartItems = location.state?.selectedItems || [];

    useEffect(() => {
        axios.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
            .then(response => {
                setProvince(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu tỉnh thành:', error);
            });
    }, []);

    const handleCityChange = (event) => {
        const cityId = event.target.value;
        setSelectedCity(cityId);
        setDistricts([]);
        setWards([]);

        if (cityId) {
            const city = province.find(city => city.Id === cityId);
            setDistricts(city?.Districts || []);
        }
    };

    const handleDistrictChange = (event) => {
        const districtId = event.target.value;
        setSelectedDistrict(districtId);
        setWards([]);

        if (districtId) {
            const city = province.find(city => city.Id === selectedCity);
            const district = city?.Districts.find(district => district.Id === districtId);
            setWards(district?.Wards || []);
        }
    };

    const handleWardChange = (event) => {
        setSelectedWard(event.target.value);
    };

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleVnpayPayment = async (orderData) => {
        try {
            console.log('Order Data:', orderData); // Kiểm tra dữ liệu đầu vào
    
            const response = await axios.post('http://localhost:8080/api/orders/createOrderVnpay', null, {
                params: orderData
            });
    
            console.log('Response Status:', response.status); // Kiểm tra mã trạng thái
            console.log('Response Data:', response.data); // Kiểm tra dữ liệu trả về
    
            if (response.status === 200) {
                const vnpayUrl = response.data;
                console.log('VNPAY URL:', vnpayUrl); // Kiểm tra URL
    
                if (vnpayUrl && vnpayUrl.startsWith('http')) { // Đảm bảo URL hợp lệ
                    window.location.replace(vnpayUrl); // Điều hướng đến VNPAY
                } else {
                    confirmAlert({
                        title: 'Lỗi',
                        message: 'URL thanh toán không hợp lệ!',
                        buttons: [
                            {
                                label: 'OK',
                                onClick: () => {}
                            }
                        ]
                    });
                }
            } else {
                confirmAlert({
                    title: 'Lỗi',
                    message: 'Có lỗi xảy ra khi xử lý thanh toán!',
                    buttons: [
                        {
                            label: 'OK',
                            onClick: () => {}
                        }
                    ]
                });
            }
        } catch (error) {
            console.error('Có lỗi xảy ra khi xử lý thanh toán VNPAY:', error);
            confirmAlert({
                title: 'Lỗi',
                message: `Có lỗi xảy ra: ${error.message}`,
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => {}
                    }
                ]
            });
        }
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userCookie = Cookies.get('user');
        const user = userCookie ? JSON.parse(userCookie) : null;
        const accountId = user ? user.id : null;

        if (!accountId) {
            confirmAlert({
                title: 'Lỗi',
                message: 'Không tìm thấy thông tin người dùng!',
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => {}
                    }
                ]
            });
            return;
        }

        if (!selectedCity || !selectedDistrict || !selectedWard || !addressDetail || !phoneNumber) {
            confirmAlert({
                title: 'Cảnh báo',
                message: 'Vui lòng điền đầy đủ thông tin!',
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => {}
                    }
                ]
            });
            return;
        }

        if (cartItems.length === 0) {
            confirmAlert({
                title: 'Cảnh báo',
                message: 'Không có sản phẩm nào để thanh toán!',
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => {}
                    }
                ]
            });
            return;
        }

        const cartItemIds = cartItems
            .filter(item => item.isSelected)
            .map(item => item.id)
            .join(',');

        const orderData = {
            listItem: encodeURIComponent(cartItemIds),
            cartID: accountId,
            phone: phoneNumber,
            Province: selectedCity,
            District: selectedDistrict,
            Ward: selectedWard,
            Note: addressDetail,
            PaymentID: paymentMethod === 'vnpay' ? 1 : 2
        };

        if (paymentMethod === 'vnpay') {
            handleVnpayPayment(orderData);
        } else {
            try {
                const response = await axios.post('http://localhost:8080/api/orders/create', null, {
                    params: orderData
                });

                if (response.status === 201) {  // Check for status 201
                    confirmAlert({
                        title: 'Thành công',
                        message: 'Đơn hàng đã được tạo thành công!',
                        buttons: [
                            {
                                label: 'OK',
                                onClick: () => {
                                    navigate(`${ROUTERS.USER.ORDER.replace(':id', accountId)}`); // Navigate to the order page
                                }
                            }
                        ]
                    });
                } else {
                    confirmAlert({
                        title: 'Lỗi',
                        message: 'Không thể tạo đơn hàng! Vui lòng thử lại.',
                        buttons: [
                            {
                                label: 'OK',
                                onClick: () => {}
                            }
                        ]
                    });
                }
            } catch (error) {
                console.error('Có lỗi xảy ra khi tạo đơn hàng:', error);
                confirmAlert({
                    title: 'Lỗi',
                    message: 'Có lỗi xảy ra khi tạo đơn hàng!',
                    buttons: [
                        {
                            label: 'OK',
                            onClick: () => {}
                        }
                    ]
                });
            }
        }
    };

    return (
        <>
            <Breadcrumb name="Thanh Toán" />
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="phoneNumber">Số điện thoại</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>

                <div className="select-box">
                    <label htmlFor="city">Tỉnh</label>
                    <select id="city" value={selectedCity} onChange={handleCityChange}>
                        <option value="">Chọn tỉnh thành</option>
                        {province.map(city => (
                            <option key={city.Id} value={city.Id}>{city.Name}</option>
                        ))}
                    </select>
                </div>

                <div className="select-box">
                    <label htmlFor="district">Huyện</label>
                    <select id="district" value={selectedDistrict} onChange={handleDistrictChange}>
                        <option value="">Chọn quận huyện</option>
                        {districts.map(district => (
                            <option key={district.Id} value={district.Id}>{district.Name}</option>
                        ))}
                    </select>
                </div>

                <div className="select-box">
                    <label htmlFor="ward">Xã</label>
                    <select id="ward" value={selectedWard} onChange={handleWardChange}>
                        <option value="">Chọn xã</option>
                        {wards.map(ward => (
                            <option key={ward.Id} value={ward.Id}>{ward.Name}</option>
                        ))}
                    </select>
                </div>
                
                <div className="input-group">
                    <label>Số nhà, số đường</label>
                    <input
                        type="text"
                        value={addressDetail}
                        onChange={(e) => setAddressDetail(e.target.value)}
                        required
                    />
                </div>

                <div className="payment-method">
                    <h3>Phương thức thanh toán</h3>
                    <div className="payment-ck">
                        <input
                            type="radio"
                            id="payment-vnpay"
                            name="payment"
                            value="vnpay"
                            checked={paymentMethod === 'vnpay'}
                            onChange={handlePaymentMethodChange}
                        />
                        <label htmlFor="payment-vnpay">Thanh toán qua ví VNPAY</label>
                    </div>
                    <div className="payment-tm">
                        <input
                            type="radio"
                            id="payment-cash"
                            name="payment"
                            value="cash"
                            checked={paymentMethod === 'cash'}
                            onChange={handlePaymentMethodChange}
                        />
                        <label htmlFor="payment-cash">Thanh Toán khi nhận hàng</label>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <button className="checkout-button" type="submit">Thanh toán</button>
            </form>
        </>
    );
};

export default memo(CheckOutPage);
