// function check if admin is deleted
export function getAdminStatusLabel(isDeleted) {
  if (!isDeleted) {
    return {
      labelType: "info",
      labelText: "Active",
    };
  } else if (isDeleted) {
    return {
      labelType: "danger",
      labelText: "Deleted",
    };
  }
}

export const ADMIN_DETAIL_SKELETON = {
  Username: {
    name: "Username",
    value: "",
    type: "text",
    placeholder: "Username",
    label: "Username",
    widthType: "half",
  },
  Fullname: {
    name: "Fullname",
    value: "",
    type: "text",
    placeholder: "Fullname",
    label: "Fullname",
    widthType: "half",
  },
  Password: {
    name: "Password",
    value: "",
    type: "password",
    placeholder: "Password",
    label: "Password",
    widthType: "half",
  },
};
