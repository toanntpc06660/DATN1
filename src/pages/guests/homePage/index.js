import React, { useState, memo } from 'react';
import 'react-multi-carousel/lib/styles.css';
import banner1Img from 'assets/users/images/hero/banner1.jpg';
import banner2Img from 'assets/users/images/hero/banner2.jpg';
import carousel1Img from 'assets/users/images/hero/banner.jpg';
import carousel2Img from 'assets/users/images/hero/banner4.png';
import carousel3Img from 'assets/users/images/hero/banner3.png';
import './style.scss';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import ProductCard from 'components/productCard';
import ReactPaginate from 'react-paginate';
import Carousel from 'react-multi-carousel';
import 'animate.css';

const HomePage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const productsPerPage = 12; // Số lượng sản phẩm mỗi trang

    // Dữ liệu giả (mock data)
    const newProducts = [
        { id: 1, name: 'Product 1', price: 100, image: 'ao1.jpg' },
        { id: 2, name: 'Product 2', price: 200, image: 'ao4.jpg' },
        { id: 3, name: 'Product 3', price: 300, image: 'ao3.jpg' },
        { id: 4, name: 'Product 3', price: 300, image: 'ao3.jpg' },
        // ...thêm sản phẩm tùy ý
    ];

    const discountedProducts = newProducts.map(product => ({
        ...product,
        discountedPrice: product.price * 0.9, // Giảm giá 10%
    }));

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const renderFeaturedProducts = (data) => {
        return (
            <Tabs>
                <TabList>
                    {Object.keys(data).map((key, index) => (
                        <Tab key={index}>{data[key].title}</Tab>
                    ))}
                </TabList>
                {Object.keys(data).map((key, index) => (
                    <TabPanel key={index}>
                        <div className="row">
                            {data[key].products
                                .slice(currentPage * productsPerPage, (currentPage + 1) * productsPerPage)
                                .map((item, j) => (
                                    <div className="col-lg-3 col-md-4 col-sm-6 col-sx-12" key={j}>
                                        <ProductCard
                                            id={item.id}
                                            name={item.name}
                                            img={`./../featured/${item.image}`}
                                            price={item.price}
                                            discountedPrice={item.discountedPrice} // Giá đã giảm
                                        />
                                    </div>
                                ))}
                        </div>
                        <ReactPaginate
                            previousLabel={"Trước"}
                            nextLabel={"Kế tiếp"}
                            breakLabel={"..."}
                            pageCount={Math.ceil(data[key].products.length / productsPerPage)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            activeClassName={"active"}
                        />
                    </TabPanel>
                ))}
            </Tabs>
        );
    };

    const featProducts = {
        newProducts: {
            title: 'Sản Phẩm Mới Nhất',
            products: newProducts
        },
        saleProducts: {
            title: 'Đang giảm giá',
            products: discountedProducts
        }
    };

    const carouselItems = [
        { image: carousel1Img, alt: 'carousel1' },
        { image: carousel2Img, alt: 'carousel2' },
        { image: carousel3Img, alt: 'carousel3' }
    ];

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
            slidesToSlide: 1
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
            slidesToSlide: 1
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1
        }
    };

    return (
        <>
            {/* Carousel Begin */}
            <div className="carousel-container animate__animated animate__zoomInDown">
                <Carousel
                    responsive={responsive}
                    autoPlay={true}
                    autoPlaySpeed={3000}
                    infinite={true}
                    arrows={true}
                >
                    {carouselItems.map((item, index) => (
                        <div key={index} className="carousel-item">
                            <img src={item.image} alt={item.alt} />
                        </div>
                    ))}
                </Carousel>
            </div>
            {/* Carousel End */}

            {/* Featured Begin */}
            <div className="container">
                <div className="featured">
                    <div className="section-title">
                        <h2 className='animate__animated animate__heartBeat animate__infinite'>SẢN PHẨM NỔI BẬT</h2>
                    </div>
                    {renderFeaturedProducts(featProducts)}
                </div>
            </div>
            {/* Featured End */}

            {/* Banner Begin */}
            <div className="container">
                <div className="banner">
                    <div className="banner_pic">
                        <img src={banner1Img} alt="banner" />
                    </div>
                    <div className="banner_pic">
                        <img src={banner2Img} alt="banner" />
                    </div>
                </div>
            </div>
            {/* Banner End */}
        </>
    );
};

export default memo(HomePage);
