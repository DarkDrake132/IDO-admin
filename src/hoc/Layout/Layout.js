import Navbar from '../../components/Navigations/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Sidebar from '../../components/Navigations/Sidebar/Sidebar';
import { AuthContext } from '../../context/auth.context';
import React, {useContext, useEffect} from 'react';

function Layout({ children }) {

  const { authLogin } = useContext(AuthContext);
  
  if (!authLogin)
    return children
  else
    return (
      <div className="container-scroller">
        <Navbar />
        <div className="container-fluid page-body-wrapper">
          <Sidebar />
          <div className="main-panel">
            <div className="content-wrapper">
              {children}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    );
}

export default Layout;