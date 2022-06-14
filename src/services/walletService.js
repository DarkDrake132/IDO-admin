import Web3 from "web3";

export function getWeb3() {
  const web3 = new Web3(window.ethereum);
  if (typeof window.ethereum === "undefined") {
    throw { message: "Please Install Metamask" };
  }
  return web3;
}

export async function getWeb3Provider() {
  const web3 = getWeb3();
  await window.ethereum.request({ method: "eth_requestAccounts" });
  return web3;
}

export async function getAccount() {
  try {
    const web3 = getWeb3();
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  } catch (err) {
    throw err;
  }
}

export const getChainNameById = (networkID) => {
  const ID = networkID?.toString();
  switch (ID) {
    //the default case ethereum case
    /**
     * 1: Main network
     * 3: Ropsten
     * 4: Rinkby
     * 5: Goerli
     * 42: Kovan
     */
    case "1":
      case "3":
        case "4":
          case "5":
            case "42":
      return "ETH";
    case "56":
      case "97":
      return "BNB";
    case "43114":
      case "43113":
        return "AVAX";
    case "137":
      case "80001":
        return "MATIC";
    default:
      return "ETH";
  }
};

export async function accountChangeListener(accountChangeHandler) {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.on("accountsChanged", function (accounts) {
      accountChangeHandler(accounts[0]);
    });
  }
}

export async function chainChangeListener(chainChangeHandler) {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.on("chainChanged", function (_chainId) {
      chainChangeHandler(_chainId);
    });
  }
}

export async function hasConnected() {
  try {
    const web3 = getWeb3();
    const accounts = await web3.eth.getAccounts();
    return accounts[0] != undefined;
  } catch (err) {
    throw err;
  }
}

export async function onlyMainNet() {
  try {
    const web3 = getWeb3();
    const chainId = await web3.eth.getChainId();
    return chainId === 1;
  } catch (err) {
    throw err;
  }
}

export async function getBalance() {
  try {
    const web3 = getWeb3();
    const account = await getAccount();
    const balance = await web3.eth.getBalance(account);
    return Number(web3.utils.fromWei(balance, "ether"));
  } catch (err) {
    throw err;
  }
}

export async function getChainId() {
  try {
    const web3 = getWeb3();
    const chainId = await web3.eth.getChainId();
    return chainId;
  } catch (err) {
    throw err;
  }
}

export async function getChainName() {
  try {
    const web3 = getWeb3();
    const chainId = await web3.eth.getChainId();
    const response = await fetch("https://chainid.network/chains.json");
    const chainListInfo = await response.json();
    const currentChain = chainListInfo.find((e) => e.chainId == chainId);
    return currentChain.name;
  } catch (err) {
    throw err;
  }
}

/**
 * Use getGasPrice() * 300000 to get estimated gas fee
 * @returns gas's price (wei/gas)
 */
export async function getGasPrice() {
  try {
    const web3 = getWeb3();

    const response = await fetch(
      "https://ethgasstation.info/json/ethgasAPI.json"
    );
    const gasCalcInfo = await response.json();
    const averagePrice = web3.utils.toWei(
      (gasCalcInfo.average / 10).toString(),
      "Gwei"
    );

    return averagePrice;
  } catch (err) {
    throw err;
  }
}
