import React, { useContext } from "react";

import { roundUp } from "../../utils/numberUtility";
import { WalletContext } from "../../context/wallet.context";

const ConnectWalletButton = () => {
  const { walletAddress, networkChain, balance, connectWallet } =
    useContext(WalletContext);

  return (
    <div>
      <div>
        {!walletAddress ? (
          <button className="btn btn-primary" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <div className="row px-2">
            <p className="mx-1 mb-0 font-weight-bold">
              {roundUp(balance)} {networkChain.chainName} |{" "}
            </p>
            <p className="mx-1 mb-0 font-weight-bold">{walletAddress}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectWalletButton;
