const SERVER_PATH = `${process.env.NODE_ENV === "production" ? process.env.REACT_APP_API_PRODUCTION : process.env.REACT_APP_API_DEV}/api/`
//the path should have http or something like that, or else it will be block by the browser

//all api path call will be a function so make sure to use () after every call
// for applied projects
export const GET_ALL_APPLIED_PROJECTS = () => {
  return `${SERVER_PATH}applied/all`;
};
export const EXPORT_APPLIED_PROJECT_TO_EXCEL = () => {
  return `${SERVER_PATH}applied/export`;
}; //
export const GET_APPLIED_PROJECT_PAGINATE = (page = 0, limit = 5) => {
  return `${SERVER_PATH}applied?page=${page}&limit=${limit}`;
}; //
export const GET_APPLIED_PROJECT_BY_ID = (projectId) => {
  return `${SERVER_PATH}applied/${projectId}`;
}; //
export const CREATE_APPLIED_PROJECT = () => {
  return `${SERVER_PATH}applied/create`;
}; //
export const UPDATE_APPLIED_PROJECT = (projectId) => {
  return `${SERVER_PATH}applied/${projectId}/update`;
}; //
export const DELETE_APPLIED_PROJECT = (projectId) => {
  return `${SERVER_PATH}applied/${projectId}/delete`;
};
export const GET_ALL_APPLIED_PROJECT_STATUS = () => {
  return `${SERVER_PATH}applied/status`;
};
export const GET_ALL_DEVELOPMENT_STATES = () => {
  return `${SERVER_PATH}applied/development-state`;
};

//for pools
export const GET_ALL_POOLS = () => {
  return `${SERVER_PATH}pool/all`;
};
export const EXPORT_POOLS_TO_EXCEL = () => {
  return `${SERVER_PATH}pool/export`;
};
export const GET_POOLS_PAGINATE = (page = 0, limit = 5) => {
  return `${SERVER_PATH}pool?page=${page}&limit=${limit}`;
}; //
export const GET_POOL_BY_ID = (poolId) => {
  return `${SERVER_PATH}pool/${poolId}`;
}; //
export const CREATE_POOL = () => {
  return `${SERVER_PATH}pool/create`;
}; //

// whitelist page
export const EXPORT_WHITELIST_TO_EXCEL = () => {
  return `${SERVER_PATH}whitelist/export`;
};
export const GET_POOL_WHITELIST_INFORMATION = (poolAddress) => {
  return `${SERVER_PATH}whitelist?poolAddress=${poolAddress}`;
}; //
export const GET_ALL_WHITELIST_PAGINATE = (
  poolAddress,
  page = 0,
  limit = 5
) => {
  return `${SERVER_PATH}whitelist/allUsers?poolAddress=${poolAddress}&page=${page}&limit=${limit}`;
};
export const GET_ALL_VALID_WHITELIST = (poolAddress) => {
  return `${SERVER_PATH}whitelist/validUsers?poolAddress=${poolAddress}`;
};
export const GET_INVALID_WHITELIST_PAGINATE = (
  poolAddress,
  page = 0,
  limit = 5
) => {
  return `${SERVER_PATH}whitelist/invalidUsers?poolAddress=${poolAddress}&page=${page}&limit=${limit}`;
};
export const SET_WHITELIST = () => {
  return `${SERVER_PATH}whitelist/setWhitelist`;
};
export const ADD_USER_TO_WHITELIST = (poolAddress) => {
  return `${SERVER_PATH}whitelist/addUsersToWhiteList/${poolAddress}`;
};

//for users
export const GET_USERS_PAGINATE = (page = 0, limit = 5) => {
  return `${SERVER_PATH}user?page=${page}&limit=${limit}`;
}; //
export const CREATE_USER = () => {
  return `${SERVER_PATH}user/create`;
};

//for admin
export const GET_ADMINS_PAGINATE = (page = 0, limit = 5) => {
  return `${SERVER_PATH}admin/getAdminList?page=${page}&limit=${limit}`;
}

export const GET_ADMIN = (account) => {
  return `${SERVER_PATH}admin/admins/${account}`;
}
