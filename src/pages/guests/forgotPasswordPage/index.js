import { memo } from "react";
import "./style.scss";
import { AiOutlineMail } from "react-icons/ai";

import Breadcrumb from "../theme/breadcrumb";
const ForgotPasswordPage = () => {
    return (
        <>
            <Breadcrumb name="Quên mật khẩu" />
            <div className="container">
                <div className="inputs">
                    <div className="input">
                        <AiOutlineMail />
                        <input type="text" placeholder="Email..." />
                    </div>
                    <div className="submit-container">
                        <div
                            className="submit" >Quên mật khẩu
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(ForgotPasswordPage);