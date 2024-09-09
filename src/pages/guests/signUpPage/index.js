import { memo, useState } from "react";
import axios from "axios";
import "./style.scss";
import { AiFillUnlock, AiOutlineUser, AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import Breadcrumb from "../theme/breadcrumb";
import { ROUTERS } from "utils/router";
import { Link } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import 'animate.css';
import { FaArrowLeft } from "react-icons/fa";

const SignUpPage = () => {
    const [action, setAction] = useState("Đăng kí");
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        image: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/register", {
                username: formData.username,
                password: formData.password,
                fullname: formData.fullname,
                email: formData.email,
                phone: formData.phone,
                image: formData.image
            });

            confirmAlert({
                title: 'Thành công',
                message: 'Đăng ký tài khoản thành công!',
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => {
                            setAction("Đăng nhập");
                            window.location.href = ROUTERS.GUEST.SIGNIN;
                        }
                    }
                ]
            });

            setError(""); 
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại";
            confirmAlert({
                title: 'Lỗi',
                message: errorMessage,
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => { }
                    }
                ]
            });
        }
    };

    return (
        <>
            <Breadcrumb name={action} />
            <div className="container-signup animate__animated animate__fadeIn">
                <div className="signup-header">
                    <h1 className="animate__animated animate__fadeInUp">{action}</h1>
                    <p className="animate__animated animate__fadeInUp">Điền thông tin của bạn để tạo tài khoản mới.</p>
                    <br/>
                </div>
                <form className="inputs-signup" onSubmit={handleSubmit}>
                    <div className="input-signup animate__animated animate__bounceIn">
                        <AiOutlineUser />
                        <input
                            type="text"
                            name="fullname"
                            placeholder="Họ và tên"
                            value={formData.fullname}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-signup animate__animated animate__bounceIn">
                        <AiOutlineUser />
                        <input
                            type="text"
                            name="username"
                            placeholder="Tài khoản"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-signup animate__animated animate__bounceIn">
                        <AiFillUnlock />
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-signup animate__animated animate__bounceIn">
                        <AiFillUnlock />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-signup animate__animated animate__bounceIn">
                        <AiOutlineMail />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-signup animate__animated animate__bounceIn">
                        <AiOutlinePhone />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Số điện thoại"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="submit-container-signup">
                        <button type="submit" className="submit animate__animated animate__zoomIn">Đăng kí</button>
                        <Link to={ROUTERS.GUEST.SIGNIN} className="login-link animate__animated animate__fadeIn" onClick={() => setAction("Đăng nhập")}>
                            <FaArrowLeft /> Đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
};

export default memo(SignUpPage);
