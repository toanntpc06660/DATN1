import { memo } from "react";
import "./style.scss";

import Breadcrumb from "../theme/breadcrumb";
import { AiFillUnlock, AiOutlineMail, AiOutlineUser } from "react-icons/ai";
const ContactPage = () => {
    return (
        <>
            <Breadcrumb name="Liên hệ" />
            <div className="container">
                <div className="inputs">
                    <div className="input">
                        <AiOutlineUser />
                        <input type="text" placeholder="Họ và tên" />
                    </div>
                    <div className="input">
                        <AiOutlineMail/>
                        <input type="text" placeholder="Địa chỉ email" />
                    </div>
                    <div className="input">
                        <AiFillUnlock />
                        <input type="text" placeholder="Nội dung" />
                    </div>
                    <div className="submit-container">
                            <div className="submit">
                                Gửi yêu cầu
                            </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(ContactPage);