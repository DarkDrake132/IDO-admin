import { Link } from "react-router-dom";

import DropdownList from "../../ui/DropdownList/DropdownList";
import NavProfile from "../../ui/NavProfile/NavProfile";
import Logo from "../../ui/Logo/Logo";
import ConnectWalletButton from "../../ButtonGroup/ConnectWalletButton";

function Navbar() {
  return (
    <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <Link to="/">
        <Logo classType="justify-content-center" />
      </Link>
      <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
        <button
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          data-toggle="minimize"
          onClick={(e)=>{console.log('clicked')}}
        >
          <span className="icon-menu"></span>
        </button>
        
        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item">
            <ConnectWalletButton />
          </li>
          <li className="nav-item nav-profile dropdown">
            <NavProfile />
          </li>
        </ul>
        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          data-toggle="offcanvas"
        >
          <span className="icon-menu"></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
