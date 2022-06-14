import { NETWORK_CHAINS, SELECT_NETWORK, getNetwork } from "./networkUtil";
import { convertIntegerDateToString } from "./timeUtil";
// placeholder string display when select development state
export const SELECT_DEVELOPMENT_STATE = "--Select development state--";

export const PROJECT_STATUS = {
  NEW: "new",
  PROCESS: "process",
  APPROVE: "approve",
  REFUSE: "refuse",
};

export const PROJECT_DEVELOPMENT_STATE = {
  IDEA: "Just an initial idea",
  WHITEPAPER: "Idea with whitepaper",
  DEVELOPMENT: "In development",
  READY: "Ready to launch",
  MVP: "MVP live",
  TESTNET: "Testnet",
  MAINNET: "Mainnet",
};

export const PROJECT_DETAIL_SKELETON = {
  ProjectName: {
    name: "ProjectName",
    value: "",
    type: "text",
    placeholder: "Project Name",
    label: "Project Name",
    widthType: "half",
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
  Tokenomic: {
    name: "Tokenomic",
    value: "",
    type: "url",
    placeholder: "Tokenomic",
    label: "Tokenomic",
    widthType: "half",
  },
  Twitter: {
    name: "Twitter",
    value: "",
    type: "text",
    placeholder: "Twitter",
    label: "Twitter",
    widthType: "half",
    appendButton: "twitter",
  },
  Telegram: {
    name: "Telegram",
    value: "",
    type: "url",
    placeholder: "Telegram",
    label: "Telegram",
    widthType: "half",
    appendButton: "telegram",
  },
  TotalRaise: {
    name: "TotalRaise",
    value: "",
    type: "number",
    placeholder: "Total Raise",
    label: "Total Raise",
    widthType: "half",
    prependIcon: "dollar",
  },
  BeforeRaise: {
    name: "BeforeRaise",
    value: "",
    type: "number",
    placeholder: "Before Raise",
    label: "Before Raise",
    widthType: "half",
    prependIcon: "dollar",
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
  DevelopmentState: {
    name: "DevelopmentState",
    value: "",
    type: "select",
    placeholder: "Development State",
    label: "Development State",
    widthType: "half",
    options: [
      SELECT_DEVELOPMENT_STATE,
      ...Object.values(PROJECT_DEVELOPMENT_STATE),
    ],
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

export const OWNER_DETAIL_SKELETON = {
  PersonalName: {
    name: "PersonalName",
    value: "",
    type: "text",
    placeholder: "Owner Name",
    label: "Owner Name",
    widthType: "half",
  },
  PersonalEmail: {
    name: "PersonalEmail",
    value: "",
    type: "email",
    placeholder: "Owner Email",
    label: "Owner Email",
    widthType: "half",
  },
  PersonalTelegram: {
    name: "PersonalTelegram",
    value: "",
    type: "text",
    placeholder: "Owner Telegram",
    label: "Owner Telegram",
    widthType: "half",
    appendButton: "telegram",
  },
};

// function check the applied project state
export function getProjectStatusLabel(status) {
  switch (status) {
    case PROJECT_STATUS.NEW:
      return {
        labelType: "info",
        labelText: status,
      };
    case PROJECT_STATUS.PROCESS:
      return {
        labelType: "waring",
        labelText: status,
      };
    case PROJECT_STATUS.APPROVE:
      return {
        labelType: "success",
        labelText: status,
      };
    case PROJECT_STATUS.REFUSE:
      return {
        labelType: "danger",
        labelText: status,
      };
    default:
      return {
        labelType: "danger",
        labelText: status,
      };
  }
}

// function check and get value of development state (to verify case user select '--Select development state--')
export function getDevelopmentStateValue(developmentState) {
  if (!developmentState || developmentState === SELECT_DEVELOPMENT_STATE) {
    return null;
  }
  return developmentState;
}

export function UpdateInfoToSkeleton(skeletonInfo, updateInfo) {
  //clone all information in skeleton to update
  const info = { ...skeletonInfo };

  Object.keys(updateInfo).forEach((key) => {
    //check if key is ChainId (special case) then call getNetwork from ChainId
    if (!info[key]) {
      if (key === "ChainId" && info.NetworkChain) {
        const network = getNetwork(updateInfo[key]);
        info.NetworkChain = {
          ...info.NetworkChain,
          value: network,
        };
      }
      return;
    }
    if (key.toString().includes("Begin") || key.toString().includes("End")) {
      info[key] = {
        ...info[key],
        value: convertIntegerDateToString(updateInfo[key]),
      };
    } else if (key === "StakeAddress" && info.Scope) {
      info.Scope = {
        ...info.Scope,
        value: updateInfo[key] ? "private" : "public",
      };
      info.StakeAddress = {
        ...info.StakeAddress,
        value: updateInfo[key]
      }
    } else {
      info[key] = {
        ...info[key],
        value: updateInfo[key],
      };
    }
  });
  return info;
}
