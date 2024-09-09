import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../theme/breadcrumb';
import formatNumber from 'format-number';
import './style.scss';
import Cookies from 'js-cookie';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS cho react-confirm-alert
import Slider from 'react-slick'; // Import react-slick
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'animate.css';
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';


// Cấu hình cho carousel
const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};

const ProductDetails = () => {
    const { productid } = useParams();
    const [productdetails, setProductdetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [price, setPrice] = useState(0);
    const [selectedImage, setSelectedImage] = useState('');

    // Mock data for product details
    const mockProductDetails = {
        id: productid,
        quantity: 100,
        product: {
            id: productid,
            name: 'Áo Thun Nam',
            productImages: [
                'ao1.jpg',
                'ao3.jpg',
                'ao4.jpg',
                'ao3.jpg'
            ],
            note: 'Áo thun nam chất liệu cotton, co giãn thoải mái.',
            available: true,
            quantityInStock: 50,
            category: {
                id: 1,
                name: 'Thời Trang Nam'
            },
            sizes: [
                { id: 1, name: 'S', price: 200000 },
                { id: 2, name: 'M', price: 210000 },
                { id: 3, name: 'L', price: 220000 },
                { id: 4, name: 'XL', price: 230000 }
            ]
        },
        relatedProducts: [
            {
                id: '2',
                name: 'Áo sơ mi Nữ',
                image: 'ao6.jpg',
                price: 180000
            },
            {
                id: '3',
                name: 'Áo Khoác Nam',
                image: 'ao5.jpg',
                price: 350000
            },
            {
                id: '3',
                name: 'Áo Khoác Nam',
                image: 'ao5.jpg',
                price: 350000
            }
        ]
    };

    useEffect(() => {
        const fetchProductdetails = async () => {
            try {
                setLoading(true);
                // Simulate a delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Set mock data instead of fetching from API
                setProductdetails(mockProductDetails);
                const initialSize = mockProductDetails.product.sizes[0];
                setSelectedSize(initialSize.name);
                setPrice(initialSize.price);
                setSelectedImage(mockProductDetails.product.productImages[0]); // Set the first image as the default selected image
            } catch (error) {
                setError('Có lỗi xảy ra khi tải dữ liệu.');
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (productid) {
            fetchProductdetails();
        } else {
            setError('ID sản phẩm không hợp lệ.');
            setLoading(false);
        }
    }, [productid]);

    const getUserIdFromCookies = () => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            const userData = JSON.parse(userCookie);
            return userData.id;
        }
        return null;
    };

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setQuantity(value > 0 ? value : 1);
    };

    const handleSizeChange = (event) => {
        const selectedSizeName = event.target.value;
        const selectedSizeObj = productdetails.product.sizes.find(size => size.name === selectedSizeName);
        if (selectedSizeObj) {
            setSelectedSize(selectedSizeName);
            setPrice(selectedSizeObj.price);
        }
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleAddToCart = async () => {
        if (!productdetails) return;

        const userId = getUserIdFromCookies();
        if (!userId) {
            confirmAlert({
                title: 'Chưa đăng nhập',
                message: 'Bạn phải đăng nhập để thêm sản phẩm vào giỏ hàng.',
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => { }
                    }
                ]
            });
            return;
        }

        const cartDetails = {
            quantity,
            isSelected: true,
            cart: {
                id: userId,
                account: {
                    id: userId
                }
            },
            productDetails: {
                id: productdetails.id,
                quantity: productdetails.quantity,
                product: {
                    id: productdetails.product.id,
                    name: productdetails.product.name,
                    price: price,  // Use the price based on selected size
                    images: productdetails.product.productImages,
                    note: productdetails.product.note,
                    available: productdetails.product.available,
                    quantityInStock: productdetails.product.quantityInStock,
                    category: {
                        id: productdetails.product.category.id,
                        name: productdetails.product.category.name
                    },
                    sizes: productdetails.product.sizes
                }
            }
        };

        console.log('Sending cartDetails:', cartDetails);

        try {
            // Mock response instead of sending a real request
            const response = { status: 201 };
            if (response.status === 201) {
                confirmAlert({
                    title: 'Thành công',
                    message: 'Sản phẩm đã được thêm vào giỏ hàng!',
                    buttons: [
                        {
                            label: 'OK',
                            onClick: () => { }
                        }
                    ]
                });
            }
        } catch (error) {
            console.error('Error adding to cart:', error.message);
            confirmAlert({
                title: 'Lỗi',
                message: `Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng: ${error.message}`,
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => { }
                    }
                ]
            });
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!productdetails) {
        return <div>Sản phẩm không tìm thấy.</div>;
    }

    const formatOptions = { prefix: '', suffix: ' đ', integerSeparator: '.' };
    const formattedPrice = formatNumber(formatOptions)(price);

    return (
        <>
            <Breadcrumb name="Chi tiết sản phẩm" />
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 product_details_pic">
                        <div className="main-image">
                            <img src={`../featured/${selectedImage}`} alt="" />
                        </div>
                        <div className="image-thumbnails">
                            {productdetails.product.productImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={`../featured/${image}`}
                                    alt=""
                                    onClick={() => handleImageClick(image)}
                                    className={image === selectedImage ? 'selected-thumbnail' : ''}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 product_details_text">
                        <h2>{productdetails.product.name}</h2>
                        <h3>Giá: {formattedPrice}</h3>
                        <p>Mô tả: {productdetails.product.note}</p>
                        <div>
                            <b>Kích thước: </b>
                            <select value={selectedSize} onChange={handleSizeChange}>
                                {productdetails.product.sizes && productdetails.product.sizes.map(size => (
                                    <option key={size.id} value={size.name}>
                                        {size.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <ul>
                            <li>
                                <b>Tình trạng: </b><span>{productdetails.product.available ? 'Còn hàng' : 'Hết hàng'}</span>
                            </li>
                            <li>
                                <b>Số lượng: </b>
                                <div className="quantity-wrapper">
                                    <div className="quantity-controls">
                                        <button onClick={() => setQuantity(prev => Math.max(prev - 1, 1))} className="quantity-button">-</button>
                                    </div>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        min="1"
                                        className="quantity-input"
                                    />
                                    <div className="quantity-controls">
                                        <button onClick={() => setQuantity(prev => prev + 1)} className="quantity-button">+</button>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <button type="button" onClick={handleAddToCart} className="primary-btn"><AiOutlineShoppingCart/> Thêm vào giỏ hàng</button>
                        <button type="button" onClick={handleAddToCart} className="primary-btn btn_favourite"><AiOutlineHeart className='animate__animated animate__heartBeat animate__infinite	    '/>Yêu thích</button>
                    </div>
                </div>

               
                <div className="related-products">
                    <h2>Sản phẩm liên quan</h2>
                    <Slider {...sliderSettings}>
                        {productdetails.relatedProducts.map(product => (
                            <div key={product.id} className="related-product-item">
                                <img src={`../featured/${product.image}`} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p>{formatNumber({ prefix: '₫' })(product.price)}</p>
                                <Link to={`/productdetails/${product.id}`} className="btn-detail  animate__animated animate__flash">Xem chi tiết</Link> {/* Thêm nút "Xem chi tiết" */}
                            </div>
                        ))}
                    </Slider>
                </div>

            </div>
        </>
    );
};

export default ProductDetails;
