// auth api
export const LOGIN = "/api/admin/login";

// applied project
export const DELETE_APPLIED_PROJECT = (projectId) => {
  return `/api/applied/${projectId}/delete`;
};
export const EXPORT_EXCEL = "/api/applied/export";
export const GET_TOTAL_APPLIED_PROJECT_INFO = `/api/applied/percentageAppliedProjectsInSomeDays`;

//whitelist
export const EXPORT_WHITELIST_EXCEL = "/api/whitelist/exportWhitelistTemplate";
export const IMPORT_WHITELIST_EXCEL = (poolAddress) => {
  return `/api/whitelist/importWhitelist/${poolAddress}`;
};

//user
export const FILTER_KYC = "/api/user/filter-kyc";

//pool
export const GET_TOTAL_POOL_INFO = `/api/pool/percentagePoolsInSomeDays`;