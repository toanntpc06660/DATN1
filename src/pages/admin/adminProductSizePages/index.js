import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.scss';

const AdminProductSizePage = () => {
    const [productSizes, setProductSizes] = useState([]);
    const [products, setProducts] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ productId: '', sizeId: '' });
    const [editing, setEditing] = useState(null);
    const [action, setAction] = useState('add'); // 'add' or 'edit'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsResponse = await axios.get('http://localhost:8080/api/productsss');
                console.log('Products:', productsResponse.data); // Kiểm tra dữ liệu sản phẩm
                setProducts(productsResponse.data);

                const sizesResponse = await axios.get('http://localhost:8080/api/product-sizes/sizes');
                console.log('Sizes:', sizesResponse.data); // Kiểm tra dữ liệu kích cỡ
                setSizes(sizesResponse.data);

                const productSizesResponse = await axios.get('http://localhost:8080/api/product-sizes/all');
                console.log('Product Sizes:', productSizesResponse.data); // Kiểm tra dữ liệu kích cỡ sản phẩm
                setProductSizes(productSizesResponse.data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { productId, sizeId } = formData;

        if (action === 'add') {
            try {
                await axios.post('http://localhost:8080/api/product-sizes/add', {
                    product: { id: productId },
                    size: { id: sizeId }
                });
                alert('Product size added successfully');
                setFormData({ productId: '', sizeId: '' });
                fetchProductSizes(); // Refresh the list
            } catch (err) {
                setError(err.message);
            }
        } else if (action === 'edit') {
            try {
                await axios.put(`http://localhost:8080/api/product-sizes/update/${editing.product.id}/${editing.size.id}`, {
                    product: { id: productId },
                    size: { id: sizeId }
                });
                alert('Product size updated successfully');
                setEditing(null);
                setFormData({ productId: '', sizeId: '' });
                fetchProductSizes(); // Refresh the list
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleEdit = (productSize) => {
        setEditing(productSize);
        setFormData({
            productId: productSize.product.id,
            sizeId: productSize.size.id
        });
        setAction('edit');
    };

    const handleDelete = async (productSize) => {
        try {
            await axios.delete(`http://localhost:8080/api/product-sizes/delete/${productSize.product.id}/${productSize.size.id}`);
            alert('Product size deleted successfully');
            fetchProductSizes(); // Refresh the list
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchProductSizes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/product-sizes/all');
            setProductSizes(response.data);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="admin-product-size-page">
            <h1>KÍCH THƯỚC SẢN PHẨM</h1>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="productId">SẢN PHẨM:</label>
                    <select
                        id="productId"
                        name="productId"
                        value={formData.productId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">CHỌN SẢN PHẨM</option>
                        {products && products.length > 0 ? (
                            products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))
                        ) : (
                            <option disabled>No products available</option>
                        )}

                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="sizeId">KÍCH THƯỚC:</label>
                    <select
                        id="sizeId"
                        name="sizeId"
                        value={formData.sizeId}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">CHỌN KÍCH THƯỚC</option>
                        {sizes.map((size) => (
                            <option key={size.id} value={size.id}>
                                {size.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn">
                    {action === 'add' ? 'THÊM' : 'CẬP NHẬT'}
                </button>
            </form>
            <div className="table-container">
                <table className="product-size-table">
                    <thead>
                        <tr>
                            <th>SẢN PHẨM</th>
                            <th>KÍCH THƯỚC</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {productSizes.map((ps) => (
                            <tr key={`${ps.product.id}-${ps.size.id}`}>
                                <td>{ps.product.name}</td>
                                <td>{ps.size.name}</td>
                                <td>
                                    {/* <button className="btn-edit" onClick={() => handleEdit(ps)}>Edit</button> */}
                                    <button className="btn-delete" onClick={() => handleDelete(ps)}>XÓA</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductSizePage;
