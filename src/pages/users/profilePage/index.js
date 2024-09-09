import React, { memo, useState, useEffect } from 'react';
import './style.scss';
import Breadcrumb from 'pages/guests/theme/breadcrumb';
import Cookies from 'js-cookie'; // Import thư viện js-cookie
import axios from 'axios'; // Import thư viện axios

const ProfilePage = () => {
  const [user, setUser] = useState(null); // Khởi tạo state user là null
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    email: '',
    image: null,
  });

  useEffect(() => {
    // Lấy thông tin người dùng từ cookies
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const userData = JSON.parse(userCookie);
      setUser(userData);
      setFormData({
        fullname: userData.fullname,
        phone: userData.phone,
        email: userData.email,
        image: userData.image,
      });
    }
  }, []);

  // Hàm xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prevState => ({ ...prevState, image: files[0] }));
    } else {
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }
  };

  // Hàm xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('fullname', formData.fullname);
    data.append('phone', formData.phone);
    data.append('email', formData.email);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await axios.put(`http://localhost:8080/api/accounts/editprofile/${user.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        // Cập nhật thông tin người dùng trong cookie
        Cookies.set('user', JSON.stringify(response.data));
        setUser(response.data); // Cập nhật state user với dữ liệu mới
        alert('Cập nhật thành công!');
      }
    } catch (error) {
      console.error('Có lỗi xảy ra khi cập nhật thông tin:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin.');
    }
  };

  if (!user) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <>
      <Breadcrumb name="Trang cá nhân" />
      <div className="profile-container">
        <div className="profile-row">
          <div className="profile-card">
            <div className="profile-card-header">
              <h3 className="profile-card-title">Xin chào {user.fullname}, bạn cần thay đổi gì?</h3>
            </div>
            <div className="profile-card-body">
              <form className="profile-form" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="profile-form-row">
                  <div className="profile-picture-section">
                    <img
                      alt="User Pic"
                      src={user.image ? `/featured/${user.image}` : '/default-profile.png'} // Đảm bảo đường dẫn đến ảnh đúng
                      className="profile-picture"
                    />
                    <div className="profile-file-input">
                      <input 
                        type="file" 
                        name="image" 
                        className="profile-file-input-field" 
                        id="customFile" 
                        onChange={handleChange}
                      />
                      <label className="profile-file-input-label" htmlFor="customFile">
                        Chọn ảnh mới
                      </label>
                    </div>
                  </div>
                  <div className="profile-info-section">
                    <table className="profile-info-table">
                      <tbody>
                        <tr hidden>
                          <td className="profile-info-label">Username:</td>
                          <td>
                            <input
                              type="text"
                              name="username"
                              value={user.username}
                              className="profile-info-input"
                              readOnly
                            />
                          </td>
                        </tr>
                        <tr hidden>
                          <td className="profile-info-label">Password:</td>
                          <td>
                            <input
                              type="password"
                              name="password"
                              className="profile-info-input"
                              autoComplete="current-password"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="profile-info-label">Họ và tên:</td>
                          <td>
                            <input
                              type="text"
                              name="fullname"
                              value={formData.fullname}
                              className="profile-info-input"
                              onChange={handleChange}
                              autoComplete="name"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="profile-info-label">Số điện thoại:</td>
                          <td>
                            <input
                              type="text"
                              name="phone"
                              value={formData.phone}
                              className="profile-info-input"
                              onChange={handleChange}
                              autoComplete="tel"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="profile-info-label">Email:</td>
                          <td>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              className="profile-info-input"
                              onChange={handleChange}
                              autoComplete="email"
                            />
                          </td>
                        </tr> 
                      </tbody>
                    </table>
                    <div className="profile-submit-section">
                      <button type="submit" className="profile-submit-button">
                        <i className="fas fa-save profile-submit-icon"></i> Lưu thay đổi
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ProfilePage);
