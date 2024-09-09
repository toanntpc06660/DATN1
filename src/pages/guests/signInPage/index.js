import React, { useState } from "react";
import "./style.scss";
import { AiFillUnlock, AiOutlineUser } from "react-icons/ai";
import { FaUserPlus } from "react-icons/fa";
import Breadcrumb from "../theme/breadcrumb";
import { ROUTERS } from "utils/router";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignInPage = () => {
    const [action, setAction] = useState("Đăng nhập");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const isActive = action === "Đăng nhập";

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Xóa cookie trước khi đăng nhập
        Cookies.remove('user');
        Cookies.remove('token');

        try {
            // Gửi yêu cầu POST tới API login
            const loginResponse = await axios.post("http://localhost:8080/api/login", null, {
                params: {
                    username,
                    password
                },
                withCredentials: true
            });

            const token = loginResponse.data.token; // Lấy token từ phản hồi
            const decodedToken = jwtDecode(token); // Giải mã token để lấy thông tin người dùng

            // Lưu JWT token vào Cookies
            Cookies.set('token', token, { expires: 0.5, path: '/' });

            // Lưu thông tin người dùng từ token vào cookie
            const userInfo = JSON.stringify({
                username: decodedToken.sub,
                role: decodedToken.role
            });

            Cookies.set('user', userInfo, { expires: 0.5, path: '/' });

            // Hiển thị thông báo đăng nhập thành công
            toast.success("Đăng nhập thành công!", {
                position: "top-right",
                autoClose: 3000
            });

            // Điều hướng người dùng đến trang chính
            navigate(ROUTERS.GUEST.HOME);
            window.location.reload();
        } catch (error) {
            // Xử lý lỗi khi đăng nhập thất bại
            if (error.response) {
                setError(error.response.data || "Có lỗi xảy ra khi đăng nhập.");
            } else {
                setError("Có lỗi xảy ra trong khi kết nối đến server.");
            }
            console.error("Lỗi đăng nhập:", error.message);
            toast.error("Có lỗi xảy ra khi đăng nhập.", {
                position: "top-right",
                autoClose: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Breadcrumb name={action} />
            <div className="container-login">
                <div className="icon-login animate__animated animate__flip">
                    <AiOutlineUser />
                </div>
                <form onSubmit={handleLogin}>
                    <div className="inputs">
                        <div className="input">
                            <AiOutlineUser />
                            <input
                                type="text"
                                placeholder="Tài khoản"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="input">
                            <AiFillUnlock />
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="submit-container">
                            <button
                                type="submit"
                                className="submit"
                                disabled={loading}
                            >
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </button>
                            <Link to={ROUTERS.GUEST.SIGNUP} className="register-link" onClick={() => setAction("Đăng kí")}>
                                <FaUserPlus /> Đăng kí
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </>
    );
};

export default SignInPage;
