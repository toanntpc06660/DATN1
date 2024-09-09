import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';
import './style.scss';
import { confirmAlert } from 'react-confirm-alert';
import ReactPaginate from 'react-paginate'; // Import thư viện phân trang
const AdminProductPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        image: "",
        note: "",
        available: true,
        quantityInStock: "",
        categoryId: ""
    });
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
    const productsPerPage = 5; // Số sản phẩm hiển thị mỗi trang
    const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm

    // Load products and categories from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/productadmin');
                setProducts(response.data);
            } catch (err) {
                setError('Lỗi khi tải danh sách sản phẩm');
                console.error(err);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/productadmin/categories');
                setCategories(response.data);
            } catch (err) {
                setError('Lỗi khi tải danh sách danh mục');
                console.error(err);
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);

    // Handle adding a new product
    const handleAddProduct = async () => {
        try {
            // Gửi yêu cầu POST với dữ liệu sản phẩm mới
            const response = await axios.post('http://localhost:8080/api/productadmin/create', newProduct, {
                headers: { 'Content-Type': 'application/json' }
            });

            setProducts([...products, response.data]);
            setNewProduct({
                name: "",
                price: "",
                image: "",
                note: "",
                available: true,
                quantityInStock: "",
                categoryId: ""
            });
            setIsFormVisible(false);

            // Hiển thị thông báo thành công
            confirmAlert({
                title: 'Thành công',
                message: 'Thêm sản phẩm thành công!',
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => window.location.reload() // Tải lại trang web
                    }
                ]
            });
        } catch (err) {
            console.error("Lỗi khi thêm sản phẩm:", err.response ? err.response.data : err.message);
            setError('Lỗi khi thêm sản phẩm');
        }
    };

    const handleSaveEdit = async () => {
        try {
            // Kiểm tra thông tin chỉnh sửa
            console.log('Editing Product:', editingProduct);

            // Gửi yêu cầu PUT với dữ liệu đã chỉnh sửa
            const response = await axios.put(`http://localhost:8080/api/productadmin/${editingProduct.id}`, {
                ...editingProduct,
                categoryId: editingProduct.categoryId // Cập nhật thông tin categoryId
            });

            // Cập nhật danh sách sản phẩm sau khi sửa
            setProducts(products.map(product =>
                product.id === editingProduct.id ? response.data : product
            ));
            setEditingProduct(null);
            setIsFormVisible(false);

            // Hiển thị thông báo thành công
            confirmAlert({
                title: 'Thành công',
                message: 'Cập nhật sản phẩm thành công!',
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => window.location.reload() // Tải lại trang web
                    }
                ]
            });
        } catch (err) {
            setError('Lỗi khi cập nhật sản phẩm');
            console.error('Error:', err);
        }
    };


    // Handle deleting product
    const handleDeleteProduct = async (id) => {
        confirmAlert({
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
            buttons: [
                {
                    label: 'Có',
                    onClick: async () => {
                        try {
                            await axios.delete(`http://localhost:8080/api/productadmin/${id}`);
                            setProducts(products.filter(product => product.id !== id));

                            // Hiển thị thông báo thành công
                            confirmAlert({
                                title: 'Thành công',
                                message: 'Xóa sản phẩm thành công!',
                                buttons: [
                                    {
                                        label: 'OK',
                                        onClick: () => {
                                            window.location.reload(); // Tải lại trang web
                                        }
                                    }
                                ]
                            });
                        } catch (err) {
                            setError('Lỗi khi xóa sản phẩm');
                            console.error(err);
                        }
                    }
                },
                {
                    label: 'Không',
                    onClick: () => { } // Không làm gì nếu người dùng chọn "Không"
                }
            ]
        });
    };


    // Handle editing product
    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsFormVisible(true);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value || '';
        setSearchTerm(value.toLowerCase());
        setCurrentPage(0); // Reset về trang đầu khi tìm kiếm
    };


    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('overlay')) {
            setIsFormVisible(false);
        }
    };

    const handleToggleForm = () => {
        setIsFormVisible(!isFormVisible);
    };

    const handleCancel = () => {
        setIsFormVisible(false);
    };
    // Handle page change
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };
    const filteredProducts = products.filter(product => {
        const productName = product.name ? product.name.toLowerCase() : '';
        return productName.includes(searchTerm.toLowerCase());
    });

    const currentProducts = filteredProducts.slice(currentPage * productsPerPage, (currentPage + 1) * productsPerPage);

    return (
        <div className="admin-product-page">
            <div className="header">
                <h1>Danh Sách Sản Phẩm</h1>
                <button onClick={handleToggleForm} className="toggle-form-button">
                    {isFormVisible ? 'Hủy' : 'Thêm Sản Phẩm'}
                </button>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {isFormVisible && (
                <div className={`overlay ${isFormVisible ? 'active' : ''}`} onClick={handleOverlayClick}>
                    <div className="form-container show" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}</h2>
                        <form>
                            <label>
                                Tên:
                                <input
                                    type="text"
                                    value={editingProduct ? editingProduct.name : newProduct.name}
                                    onChange={(e) => (editingProduct ? setEditingProduct({ ...editingProduct, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value }))}
                                />
                            </label>
                            <label>
                                Giá:
                                <input
                                    type="number"
                                    value={editingProduct ? editingProduct.price : newProduct.price}
                                    onChange={(e) => (editingProduct ? setEditingProduct({ ...editingProduct, price: e.target.value }) : setNewProduct({ ...newProduct, price: e.target.value }))}
                                />
                            </label>
                            <label>
                                Hình (URL):
                                <input
                                    type="text"
                                    value={editingProduct ? editingProduct.image : newProduct.image}
                                    onChange={(e) => (editingProduct ? setEditingProduct({ ...editingProduct, image: e.target.value }) : setNewProduct({ ...newProduct, image: e.target.value }))}
                                />
                            </label>
                            <label>
                                Mô Tả:
                                <textarea
                                    value={editingProduct ? editingProduct.note : newProduct.note}
                                    onChange={(e) => (editingProduct ? setEditingProduct({ ...editingProduct, note: e.target.value }) : setNewProduct({ ...newProduct, note: e.target.value }))}
                                />
                            </label>
                            {!editingProduct && (
                                <label>
                                    Số Lượng Tồn Kho:
                                    <input
                                        type="number"
                                        value={newProduct.quantityInStock}
                                        onChange={(e) => setNewProduct({ ...newProduct, quantityInStock: e.target.value })}
                                    />
                                </label>
                            )}
                            {editingProduct && (
                                <label>
                                    Available:
                                    <input
                                        type="checkbox"
                                        checked={editingProduct.available}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, available: e.target.checked })}
                                    />
                                </label>
                            )}
                            <label>
                                Danh Mục:
                                <select
                                    value={editingProduct ? editingProduct.categoryId : newProduct.categoryId}
                                    onChange={(e) => {
                                        const categoryId = e.target.value;
                                        if (editingProduct) {
                                            setEditingProduct({ ...editingProduct, categoryId });
                                        } else {
                                            setNewProduct({ ...newProduct, categoryId });
                                        }
                                    }}
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </label>

                            <button type="button" onClick={editingProduct ? handleSaveEdit : handleAddProduct} className="submit-button">
                                {editingProduct ? 'Lưu Thay Đổi' : 'Thêm Sản Phẩm'}
                            </button>
                            {editingProduct && <button type="button" onClick={handleCancel} className="cancel-button">Hủy</button>}
                        </form>
                    </div>
                </div>
            )}
            <div className="product-list">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Giá</th>
                            <th>Hình</th>
                            <th>Mô Tả</th>
                            <th>Available</th>
                            <th>Tồn Kho</th>
                            <th>Danh Mục</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td><img src={`../featured/${product.image}`} alt={product.name} className="product-image" /></td>
                                <td>{product.note}</td>
                                <td>{product.available ? 'Có' : 'Không'}</td>
                                <td>{product.quantityInStock}</td>
                                <td>{product.category ? product.category.name : 'N/A'}</td>
                                <td>
                                    <button onClick={() => handleEditProduct(product)} className="edit-button">Sửa</button>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="delete-button">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ReactPaginate
                pageCount={Math.ceil(products.length / productsPerPage)}
                onPageChange={handlePageChange}
                containerClassName={'pagination'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
            />
        </div>
    );
};

export default memo(AdminProductPage)
