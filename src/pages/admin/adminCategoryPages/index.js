import React, { memo, useState, useEffect } from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert'; // Import confirmAlert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS cho confirm alert
import './style.scss';

const AdminCategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/categories');
                setCategories(response.data); // Điều chỉnh nếu dữ liệu không nằm trong 'content'
            } catch (error) {
                console.error('Lỗi khi lấy danh mục:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleAddCategory = async () => {
        if (newCategoryName) {
            try {
                const response = await axios.post('http://localhost:8080/api/categories', { name: newCategoryName });
                setCategories([...categories, response.data]);
                setNewCategoryName('');
                setShowForm(false);
                confirmAlert({
                    title: 'Thành Công',
                    message: 'Thể loại đã được thêm thành công.',
                    buttons: [
                        {
                            label: 'OK',
                        }
                    ]
                });
            } catch (error) {
                console.error('Lỗi khi thêm thể loại:', error);
                confirmAlert({
                    title: 'Lỗi',
                    message: 'Có lỗi xảy ra khi thêm thể loại.',
                    buttons: [
                        {
                            label: 'OK',
                        }
                    ]
                });
            }
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategoryName(category.name);
        setShowForm(true);
    };

    const handleSaveEdit = async () => {
        if (editingCategory && newCategoryName) {
            try {
                const response = await axios.put(`http://localhost:8080/api/categories/${editingCategory.id}`, { name: newCategoryName });
                setCategories(categories.map(category =>
                    category.id === editingCategory.id ? response.data : category
                ));
                setEditingCategory(null);
                setNewCategoryName('');
                setShowForm(false);
                confirmAlert({
                    title: 'Thành Công',
                    message: 'Thể loại đã được cập nhật thành công.',
                    buttons: [
                        {
                            label: 'OK',
                        }
                    ]
                });
            } catch (error) {
                console.error('Lỗi khi cập nhật thể loại:', error);
                confirmAlert({
                    title: 'Lỗi',
                    message: 'Có lỗi xảy ra khi cập nhật thể loại.',
                    buttons: [
                        {
                            label: 'OK',
                        }
                    ]
                });
            }
        }
    };

    const handleDeleteCategory = (id) => {
        confirmAlert({
            title: 'Xác Nhận Xóa',
            message: 'Bạn có chắc chắn muốn xóa thể loại này?',
            buttons: [
                {
                    label: 'Có',
                    onClick: async () => {
                        try {
                            await axios.delete(`http://localhost:8080/api/categories/${id}`);
                            setCategories(categories.filter(category => category.id !== id));
                            confirmAlert({
                                title: 'Thành Công',
                                message: 'Thể loại đã được xóa thành công.',
                                buttons: [
                                    {
                                        label: 'OK',
                                    }
                                ]
                            });
                        } catch (error) {
                            console.error('Lỗi khi xóa thể loại:', error);
                            confirmAlert({
                                title: 'Lỗi',
                                message: 'Có lỗi xảy ra khi xóa thể loại.',
                                buttons: [
                                    {
                                        label: 'OK',
                                    }
                                ]
                            });
                        }
                    }
                },
                {
                    label: 'Không'
                }
            ]
        });
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setNewCategoryName('');
        setShowForm(false);
    };

    const handleShowForm = () => {
        setEditingCategory(null);
        setNewCategoryName('');
        setShowForm(true);
    };

    return (
        <div className="admin-category-page">
            <h1>Danh Sách Thể Loại</h1>

            {!showForm && (
                <button onClick={handleShowForm} className="show-form-button">
                    Thêm Thể Loại
                </button>
            )}

            {showForm && (
                <div className="form-container">
                    <h2>{editingCategory ? 'Sửa Thể Loại' : 'Thêm Thể Loại'}</h2>
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Tên thể loại"
                    />
                    <button
                        onClick={editingCategory ? handleSaveEdit : handleAddCategory}
                        className="submit-button"
                    >
                        {editingCategory ? 'Lưu Thay Đổi' : 'Thêm Thể Loại'}
                    </button>
                    <button onClick={handleCancelEdit} className="cancel-button">Hủy</button>
                </div>
            )}

            <div className="category-list">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Thể Loại</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map(category => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    <td>
                                        <button onClick={() => handleEditCategory(category)} className="edit-button">Sửa</button>
                                        <button onClick={() => handleDeleteCategory(category.id)} className="delete-button">Xóa</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default memo(AdminCategoryPage);
