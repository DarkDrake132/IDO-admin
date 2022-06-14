import { NavLink } from "react-router-dom";

const SidebarItem = (props) => {
  return (
    <li className="nav-item">
      <NavLink className="nav-link activated" end to={props.link}>
        <i className={[props.iconType, "menu-icon"].join(" ")}></i>
        <span className="menu-title">{props.name}</span>
      </NavLink>
    </li>
  );
};

export default SidebarItem;
