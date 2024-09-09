import { memo } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { ROUTERS } from 'utils/router';
import { AiOutlineEye } from 'react-icons/ai';
import { Link, generatePath } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ProductCard = ({ id, img, name, price, discountedPrice }) => {
    // Chuyển đổi giá trị thành số, nếu cần
    const formatPrice = (value) => {
        const numericValue = parseFloat(value);
        return !isNaN(numericValue) ? numericValue.toFixed(2) : '0.00';
    };

    return (
        <div className="featured_item">
            <div className="featured_item_pic">
                <img src={img} alt={name} />
                <ul className="featured_item_pic_hover">
                    <li>
                        <Link
                            to={generatePath(ROUTERS.GUEST.PRODUCTDETAILS, { productid: id })}
                            aria-label={`Xem chi tiết của ${name}`}
                        >
                            <AiOutlineEye />
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="featured_item_text">
                <h6>
                    <Link to={generatePath(ROUTERS.GUEST.PRODUCTDETAILS, { productid: id })}>
                        {name}
                    </Link>
                </h6>
                {discountedPrice ? (
                    <>
                        
                        <h5 className="discounted_price">
                            {formatPrice(discountedPrice)} VND
                        </h5>
                        <p className="old_price">{formatPrice(price)} VND</p>
                    </>
                ) : (
                    <h5>{formatPrice(price)} VND</h5>
                )}
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    id: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    discountedPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default memo(ProductCard);
