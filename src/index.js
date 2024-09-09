import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RouterCustom from './router';
import './style/style.scss';
import Cookies from 'js-cookie';

const root = ReactDOM.createRoot(document.getElementById('root'));

const App = () => {
  // Lấy giá trị cookie và giải mã
  const userCookie = Cookies.get("user");
  let role = false; // Giá trị mặc định

  if (userCookie) {
    const decodedCookie = decodeURIComponent(userCookie); // Giải mã URL encoded
    const userData = JSON.parse(decodedCookie); // Parse thành object JSON
    role = userData.role; // Lấy giá trị role
  }

  return (
    <BrowserRouter>
      <RouterCustom role={role} />
    </BrowserRouter>
  );
};

root.render(<App />);
