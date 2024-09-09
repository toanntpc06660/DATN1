import { memo, useEffect, useState } from "react";
import "./style.scss";
import { AiOutlineShoppingCart, AiOutlineCheck, AiOutlineMail, AiOutlineUser, AiFillFacebook, AiFillGoogleCircle, AiFillGithub, AiFillDribbbleSquare, AiOutlineHome, AiOutlineShop, AiOutlineBarChart, AiOutlineHeart } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTERS } from "utils/router";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isHome, setIsHome] = useState(location.pathname.length <= 1);
    const [isShowCategories, setShowCategories] = useState(isHome);
    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        const isHome = location.pathname.length <= 1;
        setIsHome(isHome);
        setShowCategories(isHome);
    }, [location]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = Cookies.get('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    setUser({ 
                        username: decodedToken.sub, 
                        role: decodedToken.roles === "ADMIN"
                    });
                } else {
                    console.log('No token found in cookie.');
                    setUser(null);
                }

                // Dữ liệu menu mẫu, có thể thay thế bằng dữ liệu thực từ API
                const menuData = [
                    { name: "TRANG CHỦ", path: ROUTERS.GUEST.HOME, icon: <AiOutlineHome /> },
                    { name: "SẢN PHẨM", path: ROUTERS.GUEST.PRODUCTS, icon: <AiOutlineShop /> },
                    { name: "LIÊN HỆ", path: ROUTERS.GUEST.CONTACT, icon: <AiOutlineMail /> },
                    { name: "BÁO CÁO", path: ROUTERS.GUEST.REPORT, icon: <AiOutlineBarChart /> },
                ];
                
                setMenus(menuData);
                setCategories(["Áo", "Quần", "Giày", "Nón"]);

                // Lấy số lượng sản phẩm trong giỏ hàng
                const fetchCartItemCount = async () => {
                    try {
                        const response = await axios.get('http://localhost:8080/api/cart/item-count');
                        setCartItemCount(response.data.count);
                    } catch (error) {
                        console.error('Lỗi khi lấy số lượng sản phẩm trong giỏ hàng:', error);
                    }
                };

                fetchCartItemCount();
            } catch (error) {
                console.error('Error during decoding or parsing:', error);
                setError('Error during decoding or parsing');
            }
        };
        loadData();
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        setUser(null);
        navigate(ROUTERS.GUEST.LOGIN);
    };

    return (
        <>
            <div className="header_top">
                <div className="container">
                    <div className="row">
                        <div className="col-6 header_top_left">
                            <ul>
                                <li><AiOutlineMail /> hungdqpc06637@gmail.com</li>
                                <li><AiOutlineCheck /> Miễn phí ship đơn từ 500k</li>
                            </ul>
                        </div>
                        <div className="col-6 header_top_right">
                            <ul>
                                <li><AiFillFacebook /></li>
                                <li><AiFillGoogleCircle /></li>
                                <li><AiFillGithub /></li>
                                <li><AiFillDribbbleSquare /></li>
                                {!user ? (
                                    <li>
                                        <AiOutlineUser />
                                        <Link to={ROUTERS.GUEST.SIGNIN}>
                                            <span>Đăng nhập</span>
                                        </Link>
                                    </li>
                                ) : (
                                    <li className="nav-item dropdown">
                                        <div className="nav-link dropdown-toggle"
                                            role="button"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false">Hi {user.username}
                                        </div>
                                        <div className="dropdown-menu">
                                            {user.role && (
                                                <Link to="/admin" className="dropdown-item">Quản lý bán hàng</Link>
                                            )}
                                            <Link to={`/myAcc/Order/${user.id}`} className="dropdown-item">Lịch sử đơn hàng</Link>
                                            <Link to={`/myAcc/profile/${user.id}`} className="dropdown-item">Quản lý tài khoản</Link>
                                            <Link to={ROUTERS.GUEST.SIGNIN} className="dropdown-item" onClick={handleLogout}>
                                                Đăng xuất
                                            </Link>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="header_logo">
                            <img 
                            className="header_logo_img"
                            src="https://th.bing.com/th/id/OIP.PEO4PUqEnSltdmh7sX5BGAHaHa?rs=1&pid=ImgDetMain"/>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="header_menu">
                            <nav>
                                <ul>
                                    {menus.map((menu, menuKey) => (
                                        <li key={menuKey} className={menuKey === 0 ? "active" : ""}>
                                            <Link to={menu.path}>
                                                {menu.icon}
                                                {menu.name}
                                            </Link>
                                            {menu.child && (
                                                <ul className="header_menu_dropdown">
                                                    {menu.child.map((childItem, childKey) => (
                                                        <li key={`${menuKey}-${childKey}`}>
                                                            <Link to={childItem.path}>
                                                                {childItem.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                    <div className="col-xl-3">
                        <div className="header_cart">
                            <div className="header_cart_price">
                                <ul>
                                    <li>
                                        <Link to={ROUTERS.GUEST.CART}>
                                            <AiOutlineShoppingCart />
                                            <span>{cartItemCount}</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={ROUTERS.GUEST.FAVOURITE}>
                                            <AiOutlineHeart />
                                            <span>{cartItemCount}</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(Header);
