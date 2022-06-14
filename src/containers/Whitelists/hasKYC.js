import { useState, useEffect, useContext, Fragment } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Big from "big.js";

import Table from "../../components/Table/Table";
import Card from "../../components/Card/Card";
import ButtonGroup from "../../components/ButtonGroup/ButtonGroup";
import FormGroup from "../../components/FormGroup/FormGroup";
import DashboardCard from "../../components/ui/DashboardCard/DashboardCard";
import Spinner from "../../components/ui/Spinner/Spinner";

import {
  GET_ALL_VALID_WHITELIST,
  GET_POOL_WHITELIST_INFORMATION,
  SET_WHITELIST,
  GET_POOL_BY_ID,
} from "../../utils/apiPaths";

import {
  MAX_AMOUNT_SKELETON,
  WHITELIST_AMOUNT_SKELETON,
} from "../../utils/whitelistUtil";
import {
  WHITELIST_TABLE_HEADER,
  formatWhitelist,
} from "../../utils/tableListUtil";
import { convertIntegerDateToString } from "../../utils/timeUtil";
import { getNetwork } from "../../utils/networkUtil"

import Swal from "sweetalert";

import { WalletContext } from "../../context/wallet.context";
import { getWeb3Provider } from "../../services/walletService";
import {
  addWhitelist,
  isWhitelisted,
  getPool,
} from "../../contract/controllers/pool";
import { makeWhitelist } from "../../contract/controllers/stake";

export default function HasKYCWhitelists() {
  const navigate = useNavigate();
  const { networkChain } = useContext(WalletContext);
  const [searchParams] = useSearchParams();
  const [poolId] = useState(useParams().poolId);
  const [poolAddress] = useState(searchParams.get("poolAddress"));
  const [poolScope] = useState(searchParams.get("scope"));

  const [date, setDate] = useState({
    openDate: "",
    closeDate: "",
  });
  const [usersJoin, setUsersJoin] = useState({
    totalUsers: 0,
    validUsers: 0,
    whitelistedUsers: 0,
  });

  const [whitelist, setWhitelist] = useState([]);

  const [maxAmount, setMaxAmount] = useState(MAX_AMOUNT_SKELETON);
  const [whitelistAmount, setWhitelistAmount] = useState(
    WHITELIST_AMOUNT_SKELETON
  );
  const [addWhitelistLoading, setAddWhitelistLoading] = useState(false);
  const [whitelistLoading, setWhitelistLoading] = useState(false);
  const [viewWhitelistLoading, setViewWhitelistLoading] = useState(false);

  // Don't add the poolAddress into the array parameter of the useEffect or else it will be called three times when the page get first mounted
  useEffect(() => {
    // fetch information
    axios
      .get(GET_POOL_WHITELIST_INFORMATION(poolAddress), {
        headers: {
          Authorization: JSON.parse(localStorage.getItem("user"))?.user.token,
          User: JSON.parse(localStorage.getItem("user"))?.user.user.Username,
        },
      })
      .then((res) => {
        //console.log("get whitelist detail res: ", res.data);
        setDate({
          openDate: convertIntegerDateToString(res.data.WhitelistBegin),
          closeDate: convertIntegerDateToString(res.data.WhitelistEnd),
        });
        setUsersJoin({
          totalUsers: res.data.Users,
          validUsers: res.data.ValidUsers,
          whitelistedUsers: res.data.WhitelistedUsers,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const fetchAllValidUsers = () => {
    setWhitelistLoading(true);
    axios
      .get(GET_ALL_VALID_WHITELIST(poolAddress), {
        headers: {
          Authorization: JSON.parse(localStorage.getItem("user"))?.user.token,
          User: JSON.parse(localStorage.getItem("user"))?.user.user.Username,
        },
      })
      .then((res) => {
        //console.log("get whitelist res: ", res.data);
        setWhitelist(
          res.data.Whitelist.map((user, index) => ({
            ...user,
            id: index,
            handleChange: (e) => inputOnChange(e, index),
          }))
        );
        setWhitelistLoading(false);
      })
      .catch((err) => {
        setWhitelistLoading(false);
      });
  };

  useEffect(() => {
    // fetch whitelist data base on page
    if (poolScope === "public") {
      fetchAllValidUsers();
    }
  }, []);

  useEffect(() => {
    setWhitelist((prevWhitelist) => {
      const newWhitelist = [...prevWhitelist];
      return newWhitelist.map((user) => ({
        ...user,
        MaxAmount: maxAmount.MaxAmount.value,
      }));
    });
  }, [maxAmount]);

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

  const handleBackToWhitelist = () => {
    navigate(
      `/pools/${poolId}/whitelist?poolAddress=${poolAddress}&scope=${poolScope}`
    );
  };

  const saveWhitelistToContract = async (whitelistArrObj) => {
    try {
      const web3 = await connectWallet();
      await addWhitelist(web3, poolAddress, whitelistArrObj);

      //get the addresses that have been successfully added to the whitelist
      let whitelistedList = [];
      for (let i = 0; i < whitelistArrObj.length; i++) {
        if (
          await isWhitelisted(
            web3,
            poolAddress,
            whitelistArrObj[i]["UserAddress"]
          )
        ) {
          whitelistedList.push(whitelistArrObj[i]);
        }
      }

      const jsonObj = {
        PoolAddress: poolAddress,
        Whitelist: whitelistedList,
      };
      return jsonObj;
    } catch (err) {
      console.log("err: ");
      throw err;
    }
  };

  const saveWhitelistToDB = async (jsonObj) => {
    axios
      .post(SET_WHITELIST(), jsonObj, {
        headers: {
          Authorization: JSON.parse(localStorage.getItem("user"))?.user.token,
          User: JSON.parse(localStorage.getItem("user"))?.user.user.Username,
        },
      })
      .then((res) => {
        console.log(res.data);
        setMaxAmount((prevState) => ({
          MaxAmount: {
            ...prevState.MaxAmount,
            value: "",
          },
        }));
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleAddWhitelist = () => {
    if (whitelist.length <= 0) {
      Swal({
        title: "Error",
        text: "Whitelist is empty!",
        icon: "error",
      });
      return;
    }
    if ((poolScope === "public" && maxAmount.MaxAmount.value > 0) || (poolScope === "private")) {
      Swal({
        title: "Warning",
        text: "Are you sure to add all users above in to whitelist !",
        icon: "warning",
        buttons: true,
      }).then(async (isOK) => {
        if (isOK) {
          setAddWhitelistLoading(true);
          try {
            const whitelistArrObj = whitelist.map((user) => ({
              UserAddress: user.UserAddress,
              MaxAmount: parseInt(user.MaxAmount),
            }));
            const jsonObj = await saveWhitelistToContract(whitelistArrObj);
            await saveWhitelistToDB(jsonObj);
            setAddWhitelistLoading(false);
            Swal({
              title: "Success",
              text: "Set max amount successfully !",
              icon: "success",
            });
          } catch (error) {
            console.log("set whitelist err: ", error);
            setAddWhitelistLoading(false);
            Swal({
              title: "Error",
              text: "Set max amount failed !",
              icon: "error",
            });
          }
        }
      });
    } else {
      setAddWhitelistLoading(false);
      Swal({
        title: "Error",
        text: "Max amount must be greater than 0 !",
        icon: "error",
      });
    }
  };

  const handleCancel = () => {
    Swal({
      title: "Warning",
      text: "Cancel all changes and redirect to whitelist page ?",
      icon: "warning",
      buttons: true,
    }).then((isCancel) => {
      if (isCancel) {
        navigate(-1);
      }
    });
  };

  const handleInputChange = (e, setDetails) => {
    const { name, value } = e.target;
    setDetails((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value: value,
      },
    }));
  };

  const inputOnChange = (e, id) => {
    const { name, value } = e.target;
    setWhitelist((prevWhitelist) => {
      const newWhitelist = [...prevWhitelist];
      newWhitelist[id] = {
        ...newWhitelist[id],
        [name]: value,
      };
      return newWhitelist;
    });
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

  const updateMaxAmountFromStakeContract = async (e) => {
    e.preventDefault();
    setViewWhitelistLoading(true);
    if (whitelistAmount.WhitelistAmount.value <= 0) {
      Swal({
        title: "Error",
        text: "Whitelist Amount must be greater than 0 !",
        icon: "error",
      });
      setViewWhitelistLoading(false);
      return;
    }
    const poolDetail = await fetchPoolDetail(poolId);

    const web3 = await connectWallet();
    if (!web3) {
      Swal({
        title: "Error",
        text: "Please connect to the wallet !",
        icon: "error",
      });
      setViewWhitelistLoading(false);
      return;
    }
    if (networkChain.chainId != poolDetail.ChainId) {
      Swal({
        title: "Error",
        text: `You must change to ${getNetwork(poolDetail.ChainId)} network `,
        icon: "error",
      });
      setViewWhitelistLoading(false);
      return;
    }

    const poolContract = await getPool(web3, poolAddress);

    const tokenForSale = await poolContract.tokensForSale;

    

    try {
      const userList = await makeWhitelist(
        poolDetail.StakeAddress,
        whitelistAmount.WhitelistAmount.value,
        (new Big(tokenForSale)).div(new Big(10 ** 18)).toFixed()
      );
      
      const newWhitelist = userList.map((user, index) => ({
        id: index,
        IsKYC: 1,
        MaxAmount: user.MaxAmount,
        UserAddress: user.UserAddress,
      }))
      //console.log('new whitelist: ', newWhitelist);
      //set whitelist to display
      setWhitelist(newWhitelist);
      Swal({
        title: "Get whitelist from Stake contract successfully",
        text: `Total user: ${userList.length}`,
        icon: "success",
      });
      setViewWhitelistLoading(false);
    } catch (err) {
      console.log("deploy err: ", err);
      Swal({
        title: "Error",
        text: err.message,
        icon: "error",
      });
      setViewWhitelistLoading(false);
    }
  };

  const buttons = [
    {
      content: "Back to Whitelist page",
      type: "btn-outline-primary",
      onClick: handleBackToWhitelist,
    },
    {
      content: "Set Max Amount to All",
      type: "btn-primary",
      onClick: handleAddWhitelist,
      loading: addWhitelistLoading,
    },
    {
      content: "Cancel",
      type: "btn-outline-primary",
      onClick: handleCancel,
    },
  ];

  return (
    <Fragment>
      <div className="col-lg-12">
        <div className="row">
          <div className="col-lg-4 grid-margin">
            <DashboardCard
              customClass="whitelist-card mb-4"
              title="Pool scope:"
              value={poolScope}
              theme="card-dark-blue"
            />
            <DashboardCard
              customClass="whitelist-card mb-4"
              title="Users in whitelists:"
              value={usersJoin.whitelistedUsers}
              theme="card-dark-blue"
            />
          </div>
          <div className="col-lg-4 grid-margin">
            <DashboardCard
              customClass="whitelist-card mb-4"
              title="Total users have joined:"
              value={usersJoin.totalUsers}
              theme="card-light-blue"
            />
            <DashboardCard
              customClass="whitelist-card mb-4"
              title="Valid users:"
              value={usersJoin.validUsers}
              theme="card-light-blue"
            />
          </div>
          <div className="col-lg-4 grid-margin">
            <DashboardCard
              customClass="whitelist-card mb-4"
              title="Whitelist Open:"
              value={date.openDate}
              theme="card-tale"
            />
            <DashboardCard
              customClass="whitelist-card mb-4"
              title="Whitelist Close:"
              value={date.closeDate}
              theme="card-tale"
            />
          </div>
        </div>
      </div>
      <div className="col-lg-12 grid-margin stretch-card">
        <Table
          title="Pool's whitelists"
          description="List of users who want to join this pool"
          header={WHITELIST_TABLE_HEADER}
          body={formatWhitelist(whitelist)}
          loading={whitelistLoading}
        />
      </div>
      {poolScope === "public" ? (
        <div className="col-12 grid-margin stretch-card">
          <Card
            title="Max token user can buy"
            description={
              "Enter the max token apply for all user in this public pool"
            }
          >
            <FormGroup
              elements={maxAmount}
              isReadOnly={false}
              handleChange={(e) => handleInputChange(e, setMaxAmount)}
            />
          </Card>
        </div>
      ) : (
        <div className="col-12 grid-margin stretch-card">
          <Card
            title="Whitelist Amount"
            description={"View the max token user can buy from Stake Contract"}
          >
            <FormGroup
              elements={whitelistAmount}
              isReadOnly={false}
              handleChange={(e) => handleInputChange(e, setWhitelistAmount)}
            />
            <button
              className="btn btn-outline-primary"
              onClick={updateMaxAmountFromStakeContract}
              disabled={viewWhitelistLoading}
            >
              {viewWhitelistLoading && (
                <Spinner type="grow" small={true} inButton={true} />
              )}
              View
            </button>
          </Card>
        </div>
      )}
      <ButtonGroup buttons={buttons} align="center" />
    </Fragment>
  );
}
