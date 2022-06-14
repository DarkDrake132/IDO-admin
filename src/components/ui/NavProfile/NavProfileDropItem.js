import { Link } from "react-router-dom";

const NavProfileDropItem = ({ icon, text, path, onClick }) => {
  return (
    <Link className="dropdown-item" to={`${path}`} onClick={onClick}>
      <i className={icon}></i>
        {text}
    </Link>
  );
};

export default NavProfileDropItem;
