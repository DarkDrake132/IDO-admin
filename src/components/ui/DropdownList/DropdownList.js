import { Fragment } from 'react'
import DropdownItem from './DropdownItem/DropdownItem';

function DropdownList() {
  return (
    <Fragment>
      <a className="nav-link count-indicator dropdown-toggle" id="notificationDropdown" href="#" data-toggle="dropdown" >
        <i className="icon-bell mx-0"></i>
        <span className="count"></span>
      </a>
      <div className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list" aria-labelledby="notificationDropdown">
          <p className="mb-0 font-weight-normal float-left dropdown-header">Notifications</p>
          <DropdownItem bgIcon="bg-success" subject="Application Error" content="Just now" />
          <DropdownItem bgIcon="bg-warning" subject="Settings" content="Private message" />
          <DropdownItem bgIcon="bg-info" subject="New user registration" content="2 days ago" />
      </div>
    </Fragment>
  );
}
export default DropdownList;
