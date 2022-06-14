import userAPI from "../../apis/user";
import DreStake from "../class/DreStake";
const BigInt = require("big-integer");
const Web3 = require("web3");

let decimals = 18;
const DEFAULT_LOCK_TIME = 60 * 24 * 60 * 60 * 1000; // 2 months

export async function deployStakeContract(
  web3,
  startTime,
  endTime,
  lockTime = DEFAULT_LOCK_TIME,
  lockPercentage = 70
) {
  const chainId = await web3.eth.getChainId();
  if (chainId != process.env.REACT_APP_STAKE_TOKEN_CHAIN_ID) {
    throw `Please chain your Blockchain network to chainId ${process.env.REACT_APP_STAKE_TOKEN_CHAIN_ID}`;
  }
  const address = await DreStake.create(
    web3,
    process.env.REACT_APP_STAKE_TOKEN_ADDRESS,
    startTime.toString(),
    endTime.toString(),
    lockTime.toString(),
    lockPercentage
  );
  //console.log("DreStake address: " + address);
  return address;
}

export const getStake = async (web3, stakeAddress) => {
  const chainId = await web3.eth.getChainId();
  if (chainId != process.env.REACT_APP_STAKE_TOKEN_CHAIN_ID) {
    throw `Please chain your Blockchain network to chainId ${process.env.REACT_APP_STAKE_TOKEN_CHAIN_ID}`;
  }
  const stake = new DreStake();
  await stake.init(web3, stakeAddress, true);
  return stake;
};

/**
 *
 * @param {*} stakeAddress address of stake contract
 * @param {*} walletAddress address of staker. Let undefined to get all staker
 * @returns Info or List of info {user, point, maxPoint, amount}
 */
export const getStakerInfo = async (
  stakeAddress,
  walletAddress = undefined
) => {
  const web3 = new Web3(process.env.REACT_APP_BSC_PROVIDER);
  const contract = await getStake(web3, stakeAddress, false);
  if (walletAddress) {
    return await contract.stakeInfo(walletAddress);
  }

  const walletList = await contract.allStakers;
  const stakeInfoList = await Promise.all(
    walletList.map(async (wallet) => {
      const data = await contract.stakeInfo(wallet);
      return { user: wallet, ...data };
    })
  );
  return stakeInfoList.sort((x, y) => {
    return y.point - x.point;
  });
};

/**
 *
 * @param {*} web3 web3 provider
 * @param {*} stakeAddress address of stake contract
 * @param {*} walletList list of address to unlock token
 */
export const unlock = async (web3, stakeAddress, walletList) => {
  const contract = await getStake(web3, stakeAddress);
  await contract.unlock(walletList);
};

/**
 *
 * @param {*} web3 web3 provider
 * @param {*} stakeAddress address of stake contract
 * @param {*} totalWhitelistAmount number of wallet add to whitelist
 * @returns list of {UserAddress, MaxAmount}
 */
export const makeWhitelist = async (
  stakeAddress,
  totalWhitelistAmount,
  tokensForSale
) => {
  
  const list = await getStakerInfo(stakeAddress);
  const res = await userAPI.filterKYC({
    data: list.map((stake) => stake.user),
    address: true,
  });
  
  const filteredList = list.filter((stake) => {
    return Object.values(res).includes(stake.user);
  });
  
  let userPercent = 0;
  const whitelist = [];

  let i = 0;
  [1, 2, 3, 4].forEach((tierNum) => {
    userPercent += process.env[`REACT_APP_STAKE_TIER_0${tierNum}_TOKEN_PERCENT`];
    let totalUserTier =
      (totalWhitelistAmount *
        process.env[`REACT_APP_STAKE_TIER_0${tierNum}_TOKEN_PERCENT`]) /
      100;
    let totalTokenTier =
      (tokensForSale * process.env[`REACT_APP_STAKE_TIER_0${tierNum}_TOKEN_PERCENT`]) /
      100;
    while (
      i < (totalWhitelistAmount * userPercent) / 100 &&
      i < filteredList.length
    ) {
      whitelist.push({
        UserAddress: filteredList[i].user,
        MaxAmount: totalTokenTier / totalUserTier,
      });
      i++;
    }
  });
  return whitelist;
};
