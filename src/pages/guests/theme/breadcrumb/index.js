import { memo } from "react";
import "./style.scss";
//import { AiOutlineFacebook } from "react-icons/ai";
import { ROUTERS } from "utils/router";
import { Link } from "react-router-dom";
import { AiOutlineWarning } from "react-icons/ai";
import 'animate.css';
const Breadcrumb = (props) => {
    return (
        <div className="breadcrumb">
            <div className="breadcrumb_text">
                
                <h3 className="animate__animated animate__heartBeat">Cảnh báo: <AiOutlineWarning /> Ở đây có bán đồ đẹp hơn người yêu cũ của bạn. <AiOutlineWarning /></h3>
                <div className="breadcrum_option">
                    <ul>
                        <li className="link">
                            <Link to={ROUTERS.GUEST.HOME}>HOME</Link>
                        </li>
                        <li>
                            {
                                props.name
                            }
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default memo(Breadcrumb);