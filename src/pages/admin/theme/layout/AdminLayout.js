
import { memo } from "react";
import Sidebar from 'pages/admin/theme/sidebar';  
import './AdminLayout.scss';  

const Layout = ({ children,...props }) => {
  return (
    
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>

  );
};

export default memo(Layout);
