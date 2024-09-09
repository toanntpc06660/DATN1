import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import thư viện js-cookie
import './Sidebar.scss'; // Đảm bảo rằng bạn có tệp này trong thư mục đúng
import { ROUTERS } from 'utils/router';
import { FaHome, FaUsers, FaShoppingCart, FaBox, FaTag, FaSignOutAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'; // Import các biểu tượng

const Sidebars = () => {
  const [user, setUser] = useState({
    name: '',
    image: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Đọc thông tin người dùng từ cookies
    const userInfo = Cookies.get('user'); // Thay 'user' bằng tên cookie bạn sử dụng

    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      setUser({
        name: parsedUserInfo.fullname || '',
        image: parsedUserInfo.image || 'https://via.placeholder.com/50' // Đặt giá trị mặc định nếu không có hình ảnh
      });
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('user'); // Xóa cookie khi đăng xuất
    navigate(ROUTERS.LOGIN); // Điều hướng đến trang đăng nhập hoặc trang khác
  };

  return (
    <div className="sidebarsAdmin">
      <div className="sidebar-header">
        <img src={`../featured/${user.image}`} alt="User Avatar" className="user-avatar" />
        <p className="user-name">{user.name}</p>
      </div>
      <ul>
        <li>
          <Link to={ROUTERS.ADMIN.HOME}>
            <FaHome className="sidebar-icon" /> Trang Chủ
          </Link>
        </li>
        <li>
          <Link to={ROUTERS.ADMIN.USERS}>
            <FaUsers className="sidebar-icon" /> Quản Lý Người Dùng
          </Link>
        </li>
        <li>
          <Link to={ROUTERS.ADMIN.ORDERS}>
            <FaShoppingCart className="sidebar-icon" /> Quản Lý Đơn Hàng
          </Link>
        </li>
        <li>
          <Link to={ROUTERS.ADMIN.PRODUCTS}>
            <FaBox className="sidebar-icon" /> Quản Lý Sản Phẩm
          </Link>
        </li>
        <li>
          <Link to={ROUTERS.ADMIN.CATEGORY}>
            <FaTag className="sidebar-icon" /> Quản Lý Danh Mục
          </Link>
        </li>
        <li>
          <Link to={ROUTERS.ADMIN.PRODUCTSIZE}>
            <FaTag className="sidebar-icon" /> Quản Lý Size Sản Phẩm
          </Link>
        </li>
      </ul>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt className="logout-icon" /> Đăng Xuất
        </button>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaFacebook />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaTwitter />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebars;
