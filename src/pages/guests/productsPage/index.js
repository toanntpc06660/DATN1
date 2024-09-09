import React, { memo, useState, useEffect } from "react";
import Breadcrumb from "../theme/breadcrumb";
import "./style.scss";
import ProductCard from "components/productCard";
import axios from 'axios';
import 'animate.css';
const ProductsPage = () => {
    // Các loại sản phẩm
    const categories = [
        { label: "Tất cả", value: "" }, // Thêm tùy chọn để xem tất cả các sản phẩm
        { label: "Quần", value: "quần" },
        { label: "Áo", value: "áo" },
        { label: "Giày", value: "Giày" },
        { label: "Phụ kiện", value: "Phụ kiện" }, 
    ];

    // Các lựa chọn sắp xếp
    const sorts = [
        { label: "Giá thấp đến cao", value: "price,asc" },
        { label: "Giá cao đến thấp", value: "price,desc" },
        { label: "A Z", value: "name,asc" },
        { label: "Z A", value: "name,desc" },
    ];

    // Khai báo các state
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(0); // Trang hiện tại
    const [size] = useState(9); // Số lượng sản phẩm trên mỗi trang
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("price,desc"); // Giá trị sắp xếp mặc định (giá cao đến thấp)
    const [priceFrom, setPriceFrom] = useState(0);
    const [priceTo, setPriceTo] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(""); // Loại sản phẩm đã chọn

    // Hàm fetch sản phẩm từ server
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/products`, {
                params: {
                    page,
                    size,
                    sort: sortOrder.includes("price") ? sortOrder : undefined,
                    category: selectedCategory || undefined, // Sử dụng selectedCategory
                    search,
                    from: priceFrom || undefined,
                    to: priceTo || undefined,
                },
            });

            if (response.data && Array.isArray(response.data.content)) {
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            } else {
                setProducts([]);
            }
        } catch (err) {
            setError("Có lỗi xảy ra khi lấy dữ liệu sản phẩm.");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý thay đổi sắp xếp
    const handleSortChange = (newSortOrder) => {
        setSortOrder(newSortOrder);
        setPage(0); // Reset về trang đầu khi thay đổi sắp xếp
    };

    // Hàm xử lý thay đổi loại sản phẩm
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setPage(0); // Reset trang về 0 khi thay đổi loại sản phẩm
    };

    // Hàm xử lý tìm kiếm
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(0); // Reset trang về 0 khi thay đổi tìm kiếm
    };

    // Hàm xử lý thay đổi giá từ
    const handlePriceFromChange = (e) => {
        setPriceFrom(e.target.value);
        setPage(0); // Reset trang về 0 khi thay đổi giá từ
    };

    // Hàm xử lý thay đổi giá đến
    const handlePriceToChange = (e) => {
        setPriceTo(e.target.value);
        setPage(0); // Reset trang về 0 khi thay đổi giá đến
    };

    // Gọi fetchProducts mỗi khi các giá trị phụ thuộc thay đổi
    useEffect(() => {
        fetchProducts();
    }, [page, size, search, sortOrder, priceFrom, priceTo, selectedCategory]); // Thêm selectedCategory vào dependency list

    // Hàm xử lý định dạng tiền tệ
    function formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(value);
    }

    return (
        <>
            <Breadcrumb name="Danh sách sản phẩm" />
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
                        <div className="sidebar">
                            <div className="sidebar_item animate__animated animate__backInLeft">
                                <h2 className="animate__animated animate__backInLeft">TÌM KIẾM</h2>
                                <input 
                                    type="text" 
                                    value={search} 
                                    onChange={handleSearchChange} 
                                    placeholder="Tìm kiếm sản phẩm" 
                                />
                            </div>
                            <div className="sidebar_item animate__animated animate__backInLeft">
                                <h2 className="animate__animated animate__backInLeft">MỨC GIÁ</h2>
                                <div className="price-range-wrap">
                                    <div>
                                        <p>Từ:</p>
                                        <input 
                                            type="number" 
                                            min={0} 
                                            value={priceFrom}
                                            onChange={handlePriceFromChange}
                                        />
                                    </div>
                                    <div>
                                        <p>Đến:</p>
                                        <input 
                                            type="number" 
                                            min={0} 
                                            value={priceTo}
                                            onChange={handlePriceToChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="sidebar_item animate__animated animate__backInLeft">
                                <h2 className="animate__animated animate__backInLeft">LOẠI SẢN PHẨM</h2>
                                <div className="tags">
                                    {categories.map((item, key) => (
                                        <div
                                            className={`tag ${item.value === selectedCategory ? "active" : ""}`}
                                            key={key}
                                            onClick={() => handleCategoryChange(item.value)}
                                        >
                                            {item.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="sidebar_item animate__animated animate__backInLeft">
                                <h2 className="animate__animated animate__backInLeft">SẮP XẾP</h2>
                                <div className="tags">
                                    {sorts.map((item, key) => (
                                        <div
                                            className={`tag ${item.value === sortOrder ? "active" : ""}`}
                                            key={key}
                                            onClick={() => handleSortChange(item.value)}
                                        >
                                            {item.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12">
                        <div className="row">
                            {loading ? (
                                <p className="animate__hinge" >Đang tải dữ liệu...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : products.length === 0 ? (
                                <p>Không có sản phẩm nào.</p>
                            ) : (
                                products.map((product) => (
                                    <div className="col-lg-3 col-md-4 col-sm-6 col-sx-12 col-lg-4" key={product.id}>
                                        <ProductCard
                                            id={product.id}
                                            name={product.name}
                                            img={`./../featured/${product.image}`}
                                            price={formatCurrency(product.price)}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    
                </div>
                <div className="pagination-controls">
                        <button onClick={() => setPage(page - 1)} disabled={page === 0}>Trước</button>
                        <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1}>Tiếp theo</button>
                    </div>
            </div>
            
        </>
    );
};

export default memo(ProductsPage);
