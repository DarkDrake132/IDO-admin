import React from "react";
import SidebarMenu from "./SidebarMenu";

function Sidebar() {
  const admin = JSON.parse(localStorage.getItem("user"))?.user.user.Username;

  const sidebarItems = [
    {
      link: "/",
      iconType: "icon-grid",
      name: "Dashboard",
    },
    {
      link: "/users",
      iconType: "ti-user",
      name: "Users",
    },
    {
      link: "/appliedProjects",
      iconType: "ti-layout-list-thumb",
      name: "Applied List",
    },
    {
      link: "/pools",
      iconType: "ti-layout-list-thumb-alt",
      name: "Pool List",
    },
    {
      link: "/newProject",
      iconType: "ti-plus",
      name: "Apply Project",
    },
  ];

  const sidebarAdmins = [
    {
      link: "/",
      iconType: "icon-grid",
      name: "Dashboard",
    },
    {
      link: "/admins",
      iconType: "ti-user",
      name: "Admins",
    },
  ];

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      {admin === "admin" ? (
        <SidebarMenu sidebarItems={sidebarAdmins} />
      ) : (
        <SidebarMenu sidebarItems={sidebarItems} />
      )}
    </nav>
  );
}

export default Sidebar;
