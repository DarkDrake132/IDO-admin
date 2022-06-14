import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert";
import axios from "axios";

import PoolForm from "../../components/PoolForm/PoolForm";
import {
  PROJECT_DETAIL_SKELETON,
  POOL_DETAIL_SKELETON,
  SCOPE_DETAIL_SKELETON,
  WHITELIST_DETAIL_SKELETON,
  SALE_DETAIL_SKELETON,
  OTHER_DETAIL_SKELETON,
} from "../../utils/poolUtil";
import { UpdateInfoToSkeleton } from "../../utils/projectUtil";
import { GET_APPLIED_PROJECT_BY_ID, CREATE_POOL } from "../../utils/apiPaths";
import { isAllInputNotNull } from "../../utils/inputUtil";
import {
  convertStringDateToInteger,
  convertMilliSecondToSecond,
  convertDayToSecond,
} from "../../utils/timeUtil";
import { getChainId } from "../../utils/networkUtil";
import {
  deployContract,
  getSignerAddress,
} from "../../contract/controllers/pool";
import { deployStakeContract } from "../../contract/controllers/stake";
import { getWeb3Provider } from "../../services/walletService";
import { WalletContext } from "../../context/wallet.context";

const NewPool = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { networkChain } = useContext(WalletContext);
  const [projectId] = useState(params.projectId);
  const [projectDetails, setProjectDetails] = useState(PROJECT_DETAIL_SKELETON);
  const [poolDetails, setPoolDetails] = useState(POOL_DETAIL_SKELETON);
  const [scopeDetails, setScopeDetails] = useState(SCOPE_DETAIL_SKELETON);
  const [whitelistDetails, setWhitelistDetails] = useState(
    WHITELIST_DETAIL_SKELETON
  );
  const [saleDetails, setSaleDetails] = useState(SALE_DETAIL_SKELETON);
  const [otherDetails, setOtherDetails] = useState(OTHER_DETAIL_SKELETON);

  const [hasChanged, setHasChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadyToCreateStakeContract, setIsReadyToCreateStakeContract] =
    useState(false);

  useEffect(() => {
    //fetch and handle data here
    axios
      .get(GET_APPLIED_PROJECT_BY_ID(projectId), {
        headers: {
          Authorization: JSON.parse(localStorage.getItem("user"))?.user.token,
          User: JSON.parse(localStorage.getItem("user"))?.user.user.Username,
        },
      })
      .then((res) => {
        setProjectDetails(
          UpdateInfoToSkeleton(PROJECT_DETAIL_SKELETON, res.data)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, [projectId]);

  useEffect(() => {
    if (scopeDetails.Scope.value === "private") {
      //show button to create Stake contract
      setScopeDetails((prev) => ({
        ...prev,
        CreateStakeContractButton: {
          ...prev.CreateStakeContractButton,
          hidden: prev.StakeAddress.value && true,
          onClick: createStakeContractOnClick,
        },
        StakeAddress: {
          ...prev.StakeAddress,
          hidden: prev.StakeAddress.value && false,
        },
        LockTime: {
          ...prev.LockTime,
          hidden: false,
        },
        LockPercentage: {
          ...prev.LockPercentage,
          hidden: false,
        },
      }));
    } else {
      //hide CreateStakeContractButton and hide all input about StakeContract
      setScopeDetails((prev) => ({
        ...prev,
        CreateStakeContractButton: {
          ...prev.CreateStakeContractButton,
          hidden: true,
        },
        StakeAddress: {
          ...prev.StakeAddress,
          hidden: true,
        },
        LockTime: {
          ...prev.LockTime,
          hidden: true,
        },
        LockPercentage: {
          ...prev.LockPercentage,
          hidden: true,
        },
      }));
    }
  }, [scopeDetails.Scope.value]);

  useEffect(() => {
    if (!isReadyToCreateStakeContract) return;
    const handleCreateStakeContract = async () => {
      const stakeContractInputs = {
        lockTime: convertDayToSecond(scopeDetails.LockTime.value),
        lockPercentage: scopeDetails.LockPercentage.value,
      };
      const whiteListInputs = {
        startTime: convertMilliSecondToSecond(
          convertStringDateToInteger(whitelistDetails.WhitelistBegin.value)
        ),
        endTime: convertMilliSecondToSecond(
          convertStringDateToInteger(whitelistDetails.WhitelistEnd.value)
        ),
      };
      // console.log("stakeContractInputs: ", stakeContractInputs);
      // console.log("whiteListInputs: ", whiteListInputs);
      if (!isAllInputNotNull(stakeContractInputs)) {
        Swal({
          title: "Error",
          text: "Stake contract input must not be empty !",
          icon: "error",
        });
        return;
      }
      if (!isAllInputNotNull(whiteListInputs)) {
        Swal({
          title: "Error",
          text: "Whitelist time input must not be empty !",
          icon: "error",
        });
        return;
      }
      setScopeDetails((prev) => ({
        ...prev,
        CreateStakeContractButton: {
          ...prev.CreateStakeContractButton,
          loading: true,
        },
      }));
      const web3 = await connectWallet();

      if (!web3) {
        Swal({
          title: "Error",
          text: "Please connect to the wallet !",
          icon: "error",
        });
        setScopeDetails((prev) => ({
          ...prev,
          CreateStakeContractButton: {
            ...prev.CreateStakeContractButton,
            loading: false,
          },
        }));
        return;
      }

      try {
        const stakeAddress = await deployStakeContract(
          web3,
          whiteListInputs.startTime,
          whiteListInputs.endTime,
          stakeContractInputs.lockTime,
          stakeContractInputs.lockPercentage
        );
        setScopeDetails((prev) => {
          const newOptions = [...prev.Scope.options];
          newOptions.forEach((option) => (option.disabled = true));
          return {
            ...prev,
            Scope: {
              ...prev.Scope,
              options: newOptions,
            },
            CreateStakeContractButton: {
              ...prev.CreateStakeContractButton,
              loading: false,
              hidden: true,
            },
            StakeAddress: {
              ...prev.StakeAddress,
              value: stakeAddress,
              hidden: false,
            },
            LockTime: {
              ...prev.LockTime,
              disabled: true,
            },
            LockPercentage: {
              ...prev.LockPercentage,
              disabled: true,
            },
          };
        });
      } catch (err) {
        console.log("deploy err: ", err);
        Swal({
          title: "Error",
          text: err.message,
          icon: "error",
        });
        setScopeDetails((prev) => ({
          ...prev,
          CreateStakeContractButton: {
            ...prev.CreateStakeContractButton,
            loading: false,
          },
        }));
      }
    };
    handleCreateStakeContract();
    setIsReadyToCreateStakeContract(false);
  }, [isReadyToCreateStakeContract]);

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

  const createStakeContractOnClick = async () => {
    setIsReadyToCreateStakeContract(true);
  };

  const submitButtonOnClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const web3 = await connectWallet();
    if (!web3) {
      Swal({
        title: "Error",
        text: "Please connect to the wallet !",
        icon: "error",
      });
      setIsLoading(false);
    }

    const jsonObj = {
      AppliedProjectId: projectId,
      //from project details
      ChainId: getChainId(projectDetails.NetworkChain.value),
      ProjectName: projectDetails.ProjectName.value,
      Website: projectDetails.Website.value,
      Whitepaper: projectDetails.Whitepaper.value,
      Twitter: projectDetails.Twitter.value,
      Telegram: projectDetails.Telegram.value,
      Description: projectDetails.Description.value,
      //from pool details
      LogoUrl: poolDetails.LogoUrl.value,
      WhitelistLink: poolDetails.WhitelistLink.value,
      Medium: poolDetails.Medium.value,
      Github: poolDetails.Github.value,
      MoneyRaise: poolDetails.MoneyRaise.value,
      //from whitelist details
      WhitelistBegin: convertMilliSecondToSecond(
        convertStringDateToInteger(whitelistDetails.WhitelistBegin.value)
      ),
      WhitelistEnd: convertMilliSecondToSecond(
        convertStringDateToInteger(whitelistDetails.WhitelistEnd.value)
      ),
      //from sale details
      TokenAddress: saleDetails.TokenAddress.value,
      BeginTime: convertMilliSecondToSecond(
        convertStringDateToInteger(saleDetails.BeginTime.value)
      ),
      EndTime: convertMilliSecondToSecond(
        convertStringDateToInteger(saleDetails.EndTime.value)
      ),
      //from other details
      OwnerAddress: otherDetails.OwnerAddress.value,
    };

    console.log("json obj: ", jsonObj);

    if (!isAllInputNotNull(jsonObj)) {
      Swal({
        title: "Error",
        text: "Input must not be null !",
        icon: "error",
      });
      setIsLoading(false);
      return;
    }

    if (networkChain.chainId != getChainId(projectDetails.NetworkChain.value)) {
      Swal({
        title: "Error",
        text: `You must change to ${projectDetails.NetworkChain.value} network`,
        icon: "error",
      });
      setIsLoading(false);
      return;
    }

    try {
      const poolAddress = await deployContract(
        web3,
        saleDetails.TokenAddress.value,
        parseInt(saleDetails.TokenForSale.value),
        +saleDetails.TradeValue.value,
        convertMilliSecondToSecond(
          convertStringDateToInteger(saleDetails.BeginTime.value)
        ),
        convertMilliSecondToSecond(
          convertStringDateToInteger(saleDetails.EndTime.value)
        ),
        saleDetails.MinimumAmount.value,
        otherDetails.OwnerAddress.value,
        otherDetails.FeeAmount.value
      );

      if (!poolAddress) throw new Error("Pool Address return null !");

      jsonObj.PoolAddress = poolAddress;
      jsonObj.SignerAddress = await getSignerAddress(web3, poolAddress);
      if (scopeDetails.Scope.value === "private") {
        jsonObj.StakeAddress = scopeDetails.StakeAddress.value;
      }

      //fetch API to save pool to DB
      axios
        .post(CREATE_POOL(), jsonObj, {
          headers: {
            Authorization: JSON.parse(localStorage.getItem("user"))?.user.token,
            User: JSON.parse(localStorage.getItem("user"))?.user.user.Username,
          },
        })
        .then((res) => {
          setIsLoading(false);
          Swal({
            title: "Success",
            text: "Create new pool successfully !",
            icon: "success",
          }).then((ok) => {
            if (ok) {
              navigate("/pools");
            }
          });
        })
        .catch((err) => {
          setIsLoading(false);
          console.log("create pool err: ", err.response);
          Swal({
            title: "Error!",
            text: "Create pool failed !",
            icon: "error",
          });
        });
    } catch (err) {
      console.log("deploy pool contract err: ", err);
      setIsLoading(false);
      Swal({
        title: "Error",
        text: "Deploy pool contract failed !",
        icon: "error",
      });
    }
  };

  const cancelButtonOnClick = (e) => {
    e.preventDefault();
    if (hasChanged) {
      Swal({
        title: "Are you sure?",
        text: "Your change may not be save!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((isCancel) => {
        if (isCancel) {
          navigate("/pools");
        }
      });
    } else navigate(-1);
  };

  const buttons = [
    {
      content: "Submit",
      type: "btn-primary",
      onClick: submitButtonOnClick,
      loading: isLoading,
    },
    {
      content: "Cancel",
      type: "btn-light",
      onClick: cancelButtonOnClick,
    },
  ];

  return (
    <PoolForm
      //form details
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
      readOnly={false}
      setHasChanged={setHasChanged}
      //button controls
      buttons={buttons}
    />
  );
};

export default NewPool;
