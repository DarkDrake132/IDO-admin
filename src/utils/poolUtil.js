import { NETWORK_CHAINS, SELECT_NETWORK } from "./networkUtil";

export const PROJECT_DETAIL_SKELETON = {
  Id: {
    name: "Id",
    value: "",
    type: "text",
    placeholder: "Id",
    label: "Id",
    widthType: "half",
  },
  ProjectName: {
    name: "Name",
    value: "",
    type: "text",
    placeholder: "Name",
    label: "Name",
    widthType: "half",
  },
  NetworkChain: {
    name: "NetworkChain",
    value: "",
    type: "select",
    placeholder: "Network Chain",
    label: "Network Chain",
    widthType: "half",
    options: [SELECT_NETWORK, ...NETWORK_CHAINS],
  },
  Website: {
    name: "Website",
    value: "",
    type: "url",
    placeholder: "Website",
    label: "Website",
    widthType: "half",
  },
  Whitepaper: {
    name: "Whitepaper",
    value: "",
    type: "url",
    placeholder: "Whitepaper",
    label: "Whitepaper",
    widthType: "half",
  },
  Twitter: {
    name: "Twitter",
    value: "",
    type: "text",
    placeholder: "Twitter",
    label: "Twitter",
    widthType: "half",
  },
  Telegram: {
    name: "Telegram",
    value: "",
    type: "text",
    placeholder: "Telegram",
    label: "Telegram",
    widthType: "half",
  },
  Description: {
    name: "Description",
    value: "",
    type: "textarea",
    placeholder: "Description",
    label: "Description",
    widthType: "full",
    rows: 3,
  },
};

export const POOL_DETAIL_SKELETON = {
  LogoUrl: {
    name: "LogoUrl",
    value: "",
    type: "url",
    placeholder: "LogoURL",
    label: "LogoURL",
    widthType: "half",
  },
  WhitelistLink: {
    name: "WhitelistLink",
    value: "",
    type: "url",
    placeholder: "Whitelist Link",
    label: "Whitelist Link",
    widthType: "half",
  },
  Medium: {
    name: "Medium",
    value: "",
    type: "text",
    placeholder: "Medium",
    label: "Medium",
    widthType: "half",
  },
  Github: {
    name: "Github",
    value: "",
    type: "text",
    placeholder: "Github",
    label: "Github",
    widthType: "half",
  },
  MoneyRaise: {
    name: "MoneyRaise",
    value: "",
    type: "number",
    placeholder: "Total money raise",
    label: "Money raise",
    widthType: "half",
    prependIcon: "dollar",
  },
};

export const SCOPE_DETAIL_SKELETON = {
  Scope: {
    name: "Scope",
    value: "",
    type: "radios",
    label: "Project Scope",
    widthType: "half",
    options: [
      {
        name: "Scope",
        value: "public",
        label: "Public",
        disabled: false,
        defaultChecked: false,
      },
      {
        name: "Scope",
        value: "private",
        label: "Private",
        disabled: false,
        defaultChecked: false,
      },
    ],
  },
  StakeAddress: {
    name: "StakeAddress",
    value: "",
    type: "text",
    placeholder: "Address of stake contract in private pool",
    label: "Stake Address",
    widthType: "half",
    disabled: true,
    hidden: true,
  },
  LockTime: {
    name: "LockTime",
    value: "",
    type: "number",
    placeholder: "Lock time of token in contract (days)",
    label: "Lock Time",
    widthType: "half",
    hidden: true
  },
  LockPercentage: {
    name: "LockPercentage",
    value: process.env.REACT_APP_DEFAULT_LOCK_PERCENTAGE,
    type: "number",
    placeholder: "Percentage of token will be locked (%)",
    label: "Lock percentage",
    widthType: "half",
    disabled: true,
    hidden: true
  },
  CreateStakeContractButton: {
    name: "CreateStakeContract",
    type: "button",
    btnType: "btn btn-outline-primary",
    label:
      "Create Stake Contract For Private Pool (Make sure you are in BSC network)",
    content: "Create Contract",
    onClick: () => {
      console.log("default button onClick");
    },
    widthType: "half",
    loading: false,
    hidden: true,
  },
};

export const WHITELIST_DETAIL_SKELETON = {
  WhitelistBegin: {
    name: "WhitelistBegin",
    value: "",
    type: "datetime-local",
    placeholder: "Whitelist Begin",
    label: "Whitelist Begin",
    widthType: "half",
  },
  WhitelistEnd: {
    name: "WhitelistEnd",
    value: "",
    type: "datetime-local",
    placeholder: "Whitelist End",
    label: "Whitelist End",
    widthType: "half",
  },
};

export const SALE_DETAIL_SKELETON = {
  TokenAddress: {
    name: "TokenAddress",
    value: "",
    type: "text",
    placeholder: "Token Address",
    label: "Token Address",
    widthType: "half",
  },
  TokenForSale: {
    name: "TokenForSale",
    value: "",
    type: "number",
    placeholder: "Number of tokens will be sold",
    label: "Token for sale",
    widthType: "half",
  },
  TradeValue: {
    name: "TradeValue",
    value: "",
    type: "number",
    placeholder: "Value of token",
    label: "Trade value",
    widthType: "half",
    prependIcon: "dollar",
  },
  MinimumAmount: {
    name: "MinimumAmount",
    value: "",
    type: "text",
    placeholder: "Minimum Amount",
    label: "Minimum Amount",
    widthType: "half",
  },
  BeginTime: {
    name: "BeginTime",
    value: "",
    type: "datetime-local",
    placeholder: "Begin Time",
    label: "Begin Time",
    widthType: "half",
  },
  EndTime: {
    name: "EndTime",
    value: "",
    type: "datetime-local",
    placeholder: "End Time",
    label: "End Time",
    widthType: "half",
  },
};

export const OTHER_DETAIL_SKELETON = {
  OwnerAddress: {
    name: "OwnerAddress",
    value: "",
    type: "text",
    placeholder: "Owner Address",
    label: "Owner Address",
    widthType: "half",
  },
  FeeAmount: {
    name: "FeeAmount",
    value: "",
    type: "number",
    placeholder: "Percentage of commission paid to the system (%)",
    label: "Fee Amount",
    widthType: "half",
  },
};

// function check the project state (end, upcoming, in progress)
export function getPoolStatusLabel(beginTime, endTime) {
  const now = new Date().getTime() / 1000;
  if (beginTime > now) {
    return {
      labelType: "info",
      labelText: "Upcoming",
    };
  } else if (beginTime < now && endTime > now) {
    return {
      labelType: "warning",
      labelText: "In progress",
    };
  } else if (endTime < now) {
    return {
      labelType: "danger",
      labelText: "Ended",
    };
  }
}
