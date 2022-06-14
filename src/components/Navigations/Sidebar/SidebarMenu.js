import SidebarItem from "./SidebarItem";

const SidebarMenu = (props) => {
  return (
    <ul className="nav">
      {props.sidebarItems.map((sidebarItem, index) => {
        return (
          <SidebarItem
            key={index}
            link={sidebarItem.link}
            iconType={sidebarItem.iconType}
            name={sidebarItem.name}
          />
        );
      })}
    </ul>
  );
};

export default SidebarMenu;
