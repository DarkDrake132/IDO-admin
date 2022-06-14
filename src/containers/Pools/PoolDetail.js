import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert";
import axios from "axios";
import Big from "big.js";

import { WalletContext } from "../../context/wallet.context";
import { getWeb3Provider } from "../../services/walletService";
import { GET_POOL_BY_ID } from "../../utils/apiPaths";
import { getPool } from "../../contract/controllers/pool";

import PoolForm from "../../components/PoolForm/PoolForm";
import {
  PROJECT_DETAIL_SKELETON,
  POOL_DETAIL_SKELETON,
  SCOPE_DETAIL_SKELETON,
  WHITELIST_DETAIL_SKELETON,
  SALE_DETAIL_SKELETON,
  OTHER_DETAIL_SKELETON,
  getPoolStatusLabel,
} from "../../utils/poolUtil";
import { UpdateInfoToSkeleton } from "../../utils/projectUtil";
import { getNetwork } from "../../utils/networkUtil"


const PoolDetail = () => {
  const navigate = useNavigate();
  const { networkChain } = useContext(WalletContext);

  //see the params to get id
  const [poolId] = useState(useParams().poolId);
  const [poolAddress, setPoolAddress] = useState("");
  const [poolScope, setPoolScope] = useState("public");

  const [projectDetails, setProjectDetails] = useState(PROJECT_DETAIL_SKELETON);
  const [poolDetails, setPoolDetails] = useState(POOL_DETAIL_SKELETON);
  const [scopeDetails, setScopeDetails] = useState(SCOPE_DETAIL_SKELETON);
  const [whitelistDetails, setWhitelistDetails] = useState(
    WHITELIST_DETAIL_SKELETON
  );
  const [saleDetails, setSaleDetails] = useState(SALE_DETAIL_SKELETON);
  const [otherDetails, setOtherDetails] = useState(OTHER_DETAIL_SKELETON);
  const [poolStatus, setPoolStatus] = useState("");

  const [error, setError] = useState(false);


  const connectWallet = async () => {
    try {
      const web3 = await getWeb3Provider();
      return web3;
    } catch (err) {
      //console.log(err);
      if (err.code === -32002) {
        Swal({
          title: "Warning",
          text: "Please open Metamask manually !",
          icon: "warning",
        });
      }
    }
  };

  const fetchPoolDetail = async (poolId) => {
    try {
      const res = await axios.get(GET_POOL_BY_ID(poolId), {
        headers: {
          Authorization: JSON.parse(localStorage.getItem("user"))?.user.token,
          User: JSON.parse(localStorage.getItem("user"))?.user.user.Username,
        },
      });
      return res.data;
    } catch (err) {
      console.log("fetch pool detail err: ", err);
      return false;
    }
  };

  const getPoolContract = async (poolDetail) => {
    const web3 = await connectWallet();
    if (!web3) {
      Swal({
        title: "Error",
        text: "Please connect to the wallet !",
        icon: "error",
      });
      return;
    }
    if (networkChain.chainId != 0 && networkChain.chainId != poolDetail.ChainId) {
      Swal({
        title: "Error",
        text: `You must change to ${getNetwork(poolDetail.ChainId)} network to view some information`,
        icon: "error",
      });
      return;
    }

    const poolContract = await getPool(web3, poolDetail.PoolAddress);

    const tokenForSale = await poolContract.tokensForSale;
    const tradeValue = await poolContract.tradeValue;
    const minimumAmount = await poolContract.individualMinimumAmount;
    const feeAmount = await poolContract.feePercentage;

    const result = {
      TokenForSale: (new Big(tokenForSale)).div(new Big(10 ** 18)).toFixed(),
      TradeValue: (new Big(tradeValue)).div(new Big(10 ** 18)).toFixed(),
      MinimumAmount: (new Big(minimumAmount)).div(new Big(10 ** 18)).toFixed(),
      FeeAmount: new Big(feeAmount).toFixed()
    }
    return result;
  }
  

  useEffect(() => {
    //fetch and handle data here
    const getAndSetPoolData = async () => {
      const projectDetail = await fetchPoolDetail(poolId);
      setPoolAddress(projectDetail.PoolAddress);

      const poolContract = await getPoolContract(projectDetail);

      projectDetail.ProjectName = projectDetail.Name;
      projectDetail.TokenForSale = poolContract.TokenForSale;
      projectDetail.TradeValue = poolContract.TradeValue;
      projectDetail.MinimumAmount = poolContract.MinimumAmount;
      projectDetail.FeeAmount = poolContract.FeeAmount;

      
      if (projectDetail.StakeAddress) {
        setPoolScope("private");
        setScopeDetails(prev => ({
          ...prev,
          StakeAddress: {
            ...prev.StakeAddress,
            hidden: false
          }
        }))
      }
      else {
        setScopeDetails(prev => ({
          ...prev,
          StakeAddress: {
            ...prev.StakeAddress,
            hidden: true
          }
        }))
      }

      setPoolStatus(getPoolStatusLabel(projectDetail.BeginTime, projectDetail.EndTime));
      setProjectDetails(
        UpdateInfoToSkeleton(projectDetails, projectDetail)
      );
      setPoolDetails(
        UpdateInfoToSkeleton(poolDetails, projectDetail)
      );
      setScopeDetails(prev => UpdateInfoToSkeleton(prev, projectDetail));
      setWhitelistDetails(
        UpdateInfoToSkeleton(whitelistDetails, projectDetail)
      );
      setSaleDetails(UpdateInfoToSkeleton(saleDetails, projectDetail));
      setOtherDetails(UpdateInfoToSkeleton(otherDetails, projectDetail));
    }
    getAndSetPoolData();
  }, [networkChain, poolId]);

  const goToWhitelistPage = (e) => {
    e.preventDefault();
    navigate(
      `/pools/${poolId}/whitelist?poolAddress=${poolAddress}&scope=${poolScope}`
    );
  };

  const buttons = [
    {
      content: "Go to whitelist",
      type: "btn-primary",
      onClick: goToWhitelistPage,
    },
  ];

  // errors happened, it can be the poolId does not exist or call API fail
  if (error) return <div>Pool not found</div>;
  else
    return (
      <PoolForm
        //form details
        poolStatus={poolStatus}
        //
        projectDetails={projectDetails}
        setProjectDetails={setProjectDetails}
        //
        poolDetails={poolDetails}
        setPoolDetails={setPoolDetails}
        //
        scopeDetails={scopeDetails}
        setScopeDetails={setScopeDetails}
        //
        whitelistDetails={whitelistDetails}
        setWhitelistDetails={setWhitelistDetails}
        //
        saleDetails={saleDetails}
        setSaleDetails={setSaleDetails}
        //
        otherDetails={otherDetails}
        setOtherDetails={setOtherDetails}
        //
        readOnly={true}
        //button controls
        buttons={buttons}
      />
    );
};

export default PoolDetail;
