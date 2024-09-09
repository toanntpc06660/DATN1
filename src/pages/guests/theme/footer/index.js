import { memo } from "react";
import "./style.scss";
import { AiOutlineFacebook, AiOutlineInstagram, AiOutlineTikTok } from "react-icons/ai";
const Footer = () => {
    return <footer className="footer">
        <div className="container">
            <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div className="footer_about">
                        <h1 className="footer_about_logo">THỜI TRANG NAM</h1>
                        <ul>
                            <li>Địa chỉ: Cần thơ</li>
                            <li>Số điện thoại: 0327.247.263</li>
                            <li>Email: so5so6vaso9@gmail.com</li>
                        </ul>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div className="footer_widget">
                        <h6>CỬA HÀNG</h6>
                        <ul>
                            <li>
                                Liên hệ
                            </li>
                            <li>
                                Thông tin về chứng tôi
                            </li>
                            <li>
                                Sản phẩm kinh doanh
                            </li>
                        </ul>
                        <ul>
                            <li>
                                Thông tin tài khoản
                            </li>
                            <li>
                                Giỏ hàng
                            </li>
                            <li>
                                Danh sách yêu thích
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
                    <div className="footer_widget">
                        <h6>Khuyến mãi và ưu đãi</h6>
                        <p>Đăng kí nhận thông tin ở đây</p>
                        <form action="#">
                            <div className="input-group">
                                <input type="text" placeholder="nhập email..." />
                                <button type="submit" className="button-submit">Đăng kí</button>
                            </div>
                            <div className="footer_widget_social">
                                <div><AiOutlineFacebook /></div>
                                <div><AiOutlineInstagram /></div>
                                <div><AiOutlineTikTok /></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </footer>
};

export default memo(Footer);