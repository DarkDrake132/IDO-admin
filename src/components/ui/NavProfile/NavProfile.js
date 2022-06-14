import { Fragment, useContext } from 'react'
import NavProfileDropItem from './NavProfileDropItem';
import { AuthContext } from "../../../context/auth.context";

function NavProfile() {
  const { setAuthLogin, setCurrentUser } = useContext(AuthContext);
  const handleLogout = () => {
    localStorage.removeItem('user')
    setCurrentUser(null);
    setAuthLogin(false);
  }
  return (
    <Fragment>
      <a className="nav-link dropdown-toggle" href="/" data-toggle="dropdown" id="profileDropdown">
        <img src="/statics/images/dashboard/admin-ava.jpg" alt="profile" />
      </a>
      <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
        <NavProfileDropItem icon="ti-settings text-primary" text={'Settings'} />
        <NavProfileDropItem icon='ti-power-off text-primary' path='/login' onClick={handleLogout} text='Logout'/>
      </div>
    </Fragment>
  );
}
export default NavProfile;
