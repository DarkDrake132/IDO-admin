import { useState, useEffect, createContext } from "react";
import Swal from "sweetalert";

import {
  getAccount,
  hasConnected,
  getBalance,
  accountChangeListener,
  chainChangeListener,
  getChainNameById,
  getChainId,
} from "../services/walletService";

export const WalletContext = createContext();

export default function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [networkChain, setNetworkChain] = useState({
    chainId: 0,
    chainName: "",
  });
  const [reload, setReload] = useState(false);
  const [balance, setBalance] = useState(0);

  const accountChangeHandler = (newAccount) => {
    setReload(!reload);
  };

  const chainChangeHandler = (_chainId) => {
    setReload(!reload);
  };

  useEffect(() => {
    hasConnected()
      .then((res) => {
        if (res) {
          connectWallet().then((account) => {
            console.log(account);
            setWalletAddress(account);
          });
          getBalance().then((balance) => {
            setBalance(balance);
          });
          getChainId().then(function (chainId) {
            let chainName = getChainNameById(chainId);
            setNetworkChain({
              chainId: chainId,
              chainName: chainName,
            });
          });
        }
      })
      .catch((error) => {
        Swal({
          title: "Error",
          text: error.message,
          icon: "error",
        });
      });
    accountChangeListener(accountChangeHandler);
    chainChangeListener(chainChangeHandler);
  }, [reload]);

  async function connectWallet() {
    try {
      return await getAccount();
    } catch (err) {
      if (err.code === -32002) {
        Swal({
          title: "Warning",
          text: "Please open Metamask manually !",
          icon: "warning",
        });
      }
    }
  }

  const value = {
    walletAddress,
    setWalletAddress,
    networkChain,
    setNetworkChain,
    balance,
    setBalance,
    connectWallet,
  };
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
