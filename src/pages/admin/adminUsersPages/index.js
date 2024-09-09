import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert'; // Import react-confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import default styles
import './style.scss';

const AdminUserPage = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ fullname: '', email: '', phone: '', image: '', activated: true, role: false, username: '', password: '' });
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch initial user list
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/accounts');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleAddUser = async () => {
        if (newUser.fullname && newUser.email && newUser.phone && newUser.username && newUser.password) {
            try {
                const response = await axios.post('http://localhost:8080/api/accounts/create', newUser);
                setUsers([...users, response.data]);
                resetForm();
                setIsFormVisible(false);
                setErrorMessage(''); // Reset error message

                // Show success alert
                confirmAlert({
                    title: 'Thành công',
                    message: 'Người dùng đã được thêm thành công.',
                    buttons: [
                        {
                            label: 'OK',
                            onClick: () => window.location.reload() // Reload page
                        }
                    ]
                });
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    setErrorMessage('Tài khoản đã tồn tại');
                } else if (error.response && error.response.status === 400) {
                    setErrorMessage(error.response.data);
                } else {
                    console.error('Error adding user:', error);
                }
            }
        } else {
            setErrorMessage('Vui lòng điền đầy đủ thông tin.');
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsFormVisible(true);
    };

    const handleSaveEdit = async () => {
        const { username, password, ...updatedUserData } = editingUser;
        try {
            const response = await axios.put(`http://localhost:8080/api/accounts/${editingUser.id}`, updatedUserData);
            setUsers(users.map(user => (user.id === editingUser.id ? response.data : user)));
            resetForm();
            setIsFormVisible(false);

            // Show success alert
            confirmAlert({
                title: 'Thành công',
                message: 'Người dùng đã được cập nhật thành công.',
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => window.location.reload() // Reload page
                    }
                ]
            });
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    // const handleDeleteUser = (id) => {
    //     confirmAlert({
    //         title: 'Xác Nhận Xóa',
    //         message: 'Bạn có chắc chắn muốn xóa người dùng này?',
    //         buttons: [
    //             {
    //                 label: 'Có',
    //                 onClick: async () => {
    //                     try {
    //                         await axios.delete(`http://localhost:8080/api/accounts/${id}`);
    //                         setUsers(users.filter(user => user.id !== id));
                            
    //                         // Show success alert
    //                         confirmAlert({
    //                             title: 'Thành công',
    //                             message: 'Người dùng đã được xóa thành công.',
    //                             buttons: [
    //                                 {
    //                                     label: 'OK',
    //                                     onClick: () => {}
    //                                 }
    //                             ]
    //                         });
    //                     } catch (error) {
    //                         console.error('Error deleting user:', error);
    //                     }
    //                 }
    //             },
    //             {
    //                 label: 'Không',
    //                 onClick: () => {}
    //             }
    //         ]
    //     });
    // };
    

    const handleFormToggle = () => {
        if (isFormVisible) {
            resetForm();
        } else {
            setIsFormVisible(true);
        }
    };

    const resetForm = () => {
        setNewUser({ fullname: '', email: '', phone: '', image: '', activated: true, role: false, username: '', password: '' });
        setEditingUser(null);
        setIsFormVisible(false); // Ensure the form is closed when resetting
    };

    return (
        <div className="admin-user-page">
            <div className="header">
                <h1>Danh Sách Người Dùng</h1>
                <button onClick={handleFormToggle} className="toggle-form-button">
                    {isFormVisible ? 'Hủy' : 'Thêm Người Dùng'}
                </button>
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="user-list">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ Tên</th>
                            <th>Email</th>
                            <th>Số Điện Thoại</th>
                            <th>Hình Ảnh</th>
                            <th>Activated</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.fullname}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td><img src={`../featured/${user.image}`} alt={user.fullname} className="user-image" /></td>
                                <td>{user.activated ? 'Có' : 'Không'}</td>
                                <td>{user.role ? 'Admin' : 'User'}</td>
                                <td>
                                    <button onClick={() => handleEditUser(user)} className="edit-button">Cập nhật</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isFormVisible && (
                <div className="form-container">
                    <h2>{editingUser ? 'Sửa Người Dùng' : 'Thêm Người Dùng'}</h2>
                    <form>
                        <label className="form-label">
                            <span>Họ Tên:</span>
                            <input
                                type="text"
                                value={editingUser ? editingUser.fullname : newUser.fullname}
                                onChange={(e) => (editingUser ? setEditingUser({ ...editingUser, fullname: e.target.value }) : setNewUser({ ...newUser, fullname: e.target.value }))}
                            />
                        </label>
                        <label className="form-label">
                            <span>Email:</span>
                            <input
                                type="email"
                                value={editingUser ? editingUser.email : newUser.email}
                                onChange={(e) => (editingUser ? setEditingUser({ ...editingUser, email: e.target.value }) : setNewUser({ ...newUser, email: e.target.value }))}
                            />
                        </label>
                        <label className="form-label">
                            <span>Số Điện Thoại:</span>
                            <input
                                type="text"
                                value={editingUser ? editingUser.phone : newUser.phone}
                                onChange={(e) => (editingUser ? setEditingUser({ ...editingUser, phone: e.target.value }) : setNewUser({ ...newUser, phone: e.target.value }))}
                            />
                        </label>
                        <label className="form-label">
                            <span>Hình Ảnh (URL):</span>
                            <input
                                type="text"
                                value={editingUser ? editingUser.image : newUser.image}
                                onChange={(e) => (editingUser ? setEditingUser({ ...editingUser, image: e.target.value }) : setNewUser({ ...newUser, image: e.target.value }))}
                            />
                        </label>
                        {/* Hide username and password fields when editing */}
                        {!editingUser && (
                            <>
                                <label className="form-label">
                                    <span>Tài Khoản:</span>
                                    <input
                                        type="text"
                                        value={newUser.username}
                                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    />
                                </label>
                                <label className="form-label">
                                    <span>Mật Khẩu:</span>
                                    <input
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                </label>
                            </>
                        )}
                        <div className="form-buttons">
                            <button type="button" onClick={editingUser ? handleSaveEdit : handleAddUser} className="submit-button">
                                {editingUser ? 'Lưu Thay Đổi' : 'Thêm Người Dùng'}
                            </button>
                            {editingUser && <button type="button" onClick={resetForm} className="cancel-button">Hủy</button>}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default memo(AdminUserPage);
