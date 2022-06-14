import { getNetwork } from "./networkUtil";
import { getProjectStatusLabel } from "./projectUtil";
import { getPoolStatusLabel } from "./poolUtil";
import { getAdminStatusLabel } from "./adminUtil";

// table header
export const PROJECT_TABLE_HEADER = [
  "ID",
  "Project Name",
  "Network",
  "Total Raise ($)",
  "Status",
];

export const POOL_TABLE_HEADER = [
  "ID",
  "Pool Name",
  "Network",
  "Money Raise ($)",
  "Status",
];

export const USER_TABLE_HEADER = ["", "Wallet Address", "Email"];

export const ADMIN_TABLE_HEADER = ["Username", "Name", "Status"];

export const NEW_USER_TABLE_HEADER = ["", "Wallet Address", "Email", ""];

export const WHITELIST_TABLE_HEADER = [
  "",
  "User Wallet Address",
  "Max Tokens can buy",
  "Has KYC",
];

export const NEW_WHITELIST_TABLE_HEADER = ["", "User Wallet Address"];

// row skeleton
export const PROJECT_ROW_SKELETON = {
  id: "",
  name: "",
  network: "",
  totalRaise: 0,
  status: {
    labelType: "",
    labelText: "",
  },
};

export const POOL_ROW_SKELETON = {
  id: "",
  name: "",
  network: "",
  moneyRaise: 0,
  status: {
    labelType: "",
    labelText: "",
  },
};

export const USER_ROW_SKELETON = {
  id: "",
  address: "",
  email: "",
};

export const ADMIN_ROW_SKELETON = {
  id: "",
  name: "",
  status: {
    labelType: "",
    labelText: "",
  },
};

export const NEW_USER_ROW_SKELETON = {
  id: "",
  inputs: [
    {
      name: "address",
      value: "",
      type: "text",
      placeholder: "Enter wallet address",
    },
    {
      name: "email",
      value: "",
      type: "email",
      placeholder: "Enter email",
    },
  ],
  buttons: [
    {
      type: "delete",
    },
  ],
};


export const WHITELIST_ROW_SKELETON = {
  id: "",
  address: "",
  maxAmount: "",
  kyc: true,
};

export const NEW_WHITELIST_ROW_SKELETON = {
  id: "",
  inputs: [
    {
      name: "address",
      value: "",
      type: "text",
      placeholder: "Enter wallet address",
    },
  ],
  buttons: [
    {
      type: "delete",
    },
  ],
};

// format function to update data into row skeleton
export function formatProjects(projects) {
  let projectList = [];
  projects.forEach((project) => {
    let projectObj = { ...PROJECT_ROW_SKELETON };
    projectObj = {
      id: project.Id,
      name: project.ProjectName,
      network: getNetwork(project.ChainId),
      totalRaise: project.TotalRaise,
      status: getProjectStatusLabel(project.Status),
    };
    projectList.push(projectObj);
  });
  return projectList;
}

export function formatPools(pools) {
  let poolList = [];
  pools.forEach((pool) => {
    let poolObj = { ...POOL_ROW_SKELETON };
    poolObj = {
      id: pool.Id,
      name: pool.Name,
      network: getNetwork(pool.ChainId),
      moneyRaise: pool.MoneyRaise,
      status: getPoolStatusLabel(pool.BeginTime, pool.EndTime),
    };
    poolList.push(poolObj);
  });
  return poolList;
}

export function formatUsers(users, startIndex) {
  let userList = [];
  users.forEach((user, index) => {
    let userObj = { ...USER_ROW_SKELETON };
    userObj = {
      id: startIndex + index + 1,
      address: user.Address,
      email: user.Email,
    };
    userList.push(userObj);
  });
  return userList;
}

export function formatAdmins(admins, startIndex) {
  let adminList = [];
  admins.forEach((admin, index) => {
    let adminObj = { ...ADMIN_ROW_SKELETON };
    adminObj = {
      id: admin.Username,
      name: admin.Name,
      status: getAdminStatusLabel(admin.IsDeleted),
    };
    adminList.push(adminObj);
  });
  return adminList;
}

export function formatNewUsers(users) {
  let userList = [];
  users.forEach((user) => {
    let userObj = { ...NEW_USER_ROW_SKELETON };
    userObj = {
      id: user.id + 1,
      inputs: [
        {
          ...NEW_USER_ROW_SKELETON.inputs[0],
          value: user.address,
          onChange: user.handleChange,
        },
        {
          ...NEW_USER_ROW_SKELETON.inputs[1],
          value: user.email,
          onChange: user.handleChange,
        },
      ],
      buttons: [
        {
          ...NEW_USER_ROW_SKELETON.buttons[0],
          onClick: user.deleteOnClick,
        },
      ],
    };
    userList.push(userObj);
  });
  return userList;
}

export function formatWhitelist(whitelist) {
  let result = [];
  whitelist.forEach((user) => {
    let userObj = { ...WHITELIST_ROW_SKELETON };
    userObj = {
      id: user.id + 1,
      address: user.UserAddress,
      maxAmount: user.MaxAmount,
      kyc: user.IsKYC === 1 ? true : false,
    };
    result.push(userObj);
  });
  return result;
}

export function formatNewWhitelist(usersToJoin) {
  let whitelist = [];
  usersToJoin.forEach((user) => {
    let userObj = { ...NEW_WHITELIST_ROW_SKELETON };
    userObj = {
      id: user.id + 1,
      inputs: [
        {
          ...NEW_WHITELIST_ROW_SKELETON.inputs[0],
          value: user.address,
          onChange: user.handleChange,
        },
      ],
      buttons: [
        {
          ...NEW_WHITELIST_ROW_SKELETON.buttons[0],
          onClick: user.deleteOnClick,
        },
      ],
    };
    whitelist.push(userObj);
  });
  return whitelist;
}
