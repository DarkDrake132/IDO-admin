require('dotenv').config();

export const NETWORK_CHAINS = ["ETH", "BNB", "AVAX", "MATIC"];
// placeholder string display when select network chain
export const SELECT_NETWORK = '--Select network--';


// return network base on chainId
export function getNetwork(chainId) {
  chainId = chainId.toString();
  switch (chainId) {
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
}

//function return network base on chainId
export function getChainId(network) {
  switch (network) {
    case "ETH": //return rinkeby, after launch change back to main net
      return process.env.REACT_APP_ETH_CHAIN_ID;
    case "BNB":
      return process.env.REACT_APP_BNB_CHAIN_ID; //97 is BNB testnet, after launch change back to main net
    case "AVAX": 
      return process.env.REACT_APP_AVAX_CHAIN_ID;  //43113 is Polygon testnet, after launch change back to main net
    case "MATIC":
      return process.env.REACT_APP_MATIC_CHAIN_ID; //80001 is Polygon testnet, after launch change back to main net
    default:
      return null;
  }
}