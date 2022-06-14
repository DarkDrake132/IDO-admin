import { useState, useEffect, Fragment } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

import Card from "../../components/Card/Card";
import Table from "../../components/Table/Table";
import Pagination from "../../components/Pagination/Pagination";
import ButtonGroup from "../../components/ButtonGroup/ButtonGroup";
import DashboardCard from "../../components/ui/DashboardCard/DashboardCard";

import {
  GET_ALL_WHITELIST_PAGINATE,
  GET_POOL_WHITELIST_INFORMATION,
  ADD_USER_TO_WHITELIST,
} from "../../utils/apiPaths";

import whitelistAPI from "../../apis/whitelist";

import {
  WHITELIST_TABLE_HEADER,
  NEW_WHITELIST_TABLE_HEADER,
  formatWhitelist,
  formatNewWhitelist,
} from "../../utils/tableListUtil";
import { convertIntegerDateToString } from "../../utils/timeUtil";
import { isAllInputNotNull } from "../../utils/inputUtil";

import Swal from "sweetalert";

export default function Whitelists() {
  const navigate = useNavigate();
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
  const [paginateInformation, setPaginateInformation] = useState({
    page: 0,
    limit: 10,
    totalPages: 5,
  });

  const [whitelist, setWhitelist] = useState([]);
  const [hasChanged, setHasChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpenAddNewUserForm, setIsOpenAddNewUserForm] = useState(false);

  const defaultUserDetail = {
    id: 0,
    address: "",
    handleChange: (e) => console.log("default onchange"),
    deleteOnClick: (e) => console.log("default onclick"),
  };

  const [userDetails, setUserDetails] = useState([defaultUserDetail]);

  //run once to update handle change and button onclick function
  useEffect(() => {
    const id = 0;
    setUserDetails((prevUserDetails) => [
      (prevUserDetails[id] = {
        ...prevUserDetails[id],
        handleChange: (e) => inputOnChange(e, id),
        deleteOnClick: (e) => deleteButtonOnClick(e, id),
      }),
    ]);
  }, []);

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
        //console.log("get whitelist info res: ", res.data);
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

  useEffect(() => {
    // fetch whitelist data base on page
    fetchWhitelist(
      poolAddress,
      paginateInformation.page,
      paginateInformation.limit
    );
  }, [paginateInformation.page, paginateInformation.limit]);

  const fetchWhitelist = (poolAddress, page, limit) => {
    setLoading(true);
    axios
      .get(GET_ALL_WHITELIST_PAGINATE(poolAddress, page, limit), {
        headers: {
          Authorization: JSON.parse(localStorage.getItem("user"))?.user.token,
          User: JSON.parse(localStorage.getItem("user"))?.user.user.Username,
        },
      })
      .then((res) => {
        //console.log("get all whitelist paginate res: ", res.data);
        setPaginateInformation((prevState) => {
          return {
            ...prevState,
            totalPages: res.data.PageAmount,
          };
        });
        setWhitelist(
          res.data.Users.map((user, index) => ({
            ...user,
            id: index,
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const handlePageClick = (selectedPage) => {
    //set the page
    setPaginateInformation((prevState) => {
      return {
        ...prevState,
        page: selectedPage,
      };
    });
  };

  const handleDownloadExcelWhiteList = async () => {
    try {
      await whitelistAPI.ExportWhitelistTemplate();
      Swal({
        title: "Success",
        text: "Download Excel template successfully !",
        icon: "success",
      });
    } catch (err) {
      console.log("download err: ", err);
      Swal({
        title: "Error",
        text: "Download Excel template failed !",
        icon: "error",
      });
    }
  };

  const handleUploadExcelWhiteList = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("whitelist", e.target.files[0]);
      await whitelistAPI.ImportWhitelist(poolAddress, formData);
      fetchWhitelist(
        poolAddress,
        paginateInformation.page,
        paginateInformation.limit
      );
      Swal({
        title: "Success",
        text: "Upload Whitelist successfully !",
        icon: "success",
      });
    } catch (err) {
      console.log("Upload err: ", err);
      Swal({
        title: "Error",
        text: "Upload Whitelist failed !",
        icon: "error",
      });
    }
  };

  const handleOpenAddNewUserForm = () => {
    setIsOpenAddNewUserForm(true);
  };

  const validateInput = (userArr) => {
    for (let user of userArr) {
      if (!isAllInputNotNull(user)) return false;
    }
    return true;
  };

  const inputOnChange = (e, id) => {
    setHasChanged(true);
    const { name, value } = e.target;
    setUserDetails((prevUserDetails) => {
      const newUserArr = [...prevUserDetails];
      newUserArr[id] = {
        ...newUserArr[id],
        [name]: value,
      };
      return newUserArr;
    });
  };

  const deleteButtonOnClick = (e, id) => {
    setUserDetails((prevUserDetails) => {
      const newUserArr = [...prevUserDetails];
      newUserArr.splice(id, 1);
      return newUserArr.map((user, index) => ({
        ...user,
        id: index,
        handleChange: (e) => inputOnChange(e, index),
        deleteOnClick: (e) => deleteButtonOnClick(e, index),
      }));
    });
  };

  const addButtonOnClick = (e) => {
    setUserDetails((prevUserDetails) => {
      const newId = prevUserDetails.length;
      return [
        ...prevUserDetails,
        {
          id: newId,
          address: "",
          email: "",
          handleChange: (e) => inputOnChange(e, newId),
          deleteOnClick: (e) => deleteButtonOnClick(e, newId),
        },
      ];
    });
  };

  const submitButtonOnClick = (e) => {
    e.preventDefault();
    const jsonArr = userDetails.map((user) => {
      return user.address;
    });
    //console.log("json arr: ", jsonArr);
    if (!validateInput(jsonArr)) {
      //console.log('jsonObj detail: ', jsonObj)
      Swal({
        title: "Error",
        text: "Input must not be null !",
        icon: "error",
      });
    } else {
      axios
        .post(
          ADD_USER_TO_WHITELIST(poolAddress),
          { Users: jsonArr },
          {
            headers: {
              Authorization: JSON.parse(localStorage.getItem("user"))?.user
                .token,
              User: JSON.parse(localStorage.getItem("user"))?.user.user
                .Username,
            },
          }
        )
        .then((res) => {
          Swal({
            title: "Success",
            text: "Add user to whitelist successfully !",
            icon: "success",
          });
          setUserDetails([defaultUserDetail]);
          setHasChanged(false);
          fetchWhitelist(
            poolAddress,
            paginateInformation.page,
            paginateInformation.limit
          );
        })
        .catch((err) => {
          console.log("Add user to whitelist err: ", err.response);
          setUserDetails([defaultUserDetail]);
          setHasChanged(false);
          Swal({
            title: "Error!",
            text: "Something went wrong",
            icon: "error",
          });
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
          const id = 0;
          setUserDetails([
            {
              ...defaultUserDetail,
              handleChange: (e) => inputOnChange(e, id),
              deleteOnClick: (e) => deleteButtonOnClick(e, id),
            },
          ]);
          setIsOpenAddNewUserForm(false);
        }
      });
    } else {
      setIsOpenAddNewUserForm(false);
    }
  };

  const goToSetMaxAmountPage = (e) => {
    e.preventDefault();
    navigate(
      `/pools/${poolId}/hasKYCwhitelist?poolAddress=${poolAddress}&scope=${poolScope}`
    );
  };

  const backToPoolDetailPage = () => {
    navigate(-1);
  };

  const newWhitelistButtons = [
    {
      content: "Add",
      type: "btn-success",
      onClick: addButtonOnClick,
    },
    {
      content: "Submit",
      type: "btn-primary",
      onClick: submitButtonOnClick,
    },
    {
      content: "Cancel",
      type: "btn-outline-light",
      onClick: cancelButtonOnClick,
    },
  ];

  const buttons = [
    {
      content: "Back to Pool Detail Page",
      type: "btn-outline-primary",
      onClick: backToPoolDetailPage,
    },
    {
      content: "Go to Set Max Amount page",
      type: "btn-primary",
      onClick: goToSetMaxAmountPage,
    },
  ];

  const topRightButtons = (
    <div>
      <button
        type="button"
        className="btn btn-outline-info btn-icon-text mx-1"
        onClick={handleDownloadExcelWhiteList}
      >
        Download Excel Template<i className="ti-download btn-icon-append"></i>
      </button>
      <label className="btn btn-outline-info btn-icon-text mx-1 mb-0">
        Upload Excel Whitelist
        <input type="file" onChange={handleUploadExcelWhiteList} hidden />
        <i className="ti-upload btn-icon-append" />
      </label>
      <button
        type="button"
        className="btn btn-outline-info btn-icon-text mx-1"
        onClick={handleOpenAddNewUserForm}
      >
        Add User's Wallet<i className="ti-plus btn-icon-append"></i>
      </button>
    </div>
  );

  return (
    <Fragment>
      <div className="col-lg-12">
        <div className="row">
          <div className="col-lg-4 grid-margin">
            <DashboardCard
              customClass="whitelist-card mb-4 text-capitalize"
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
          topRightElement={!isOpenAddNewUserForm && topRightButtons}
          loading={loading}
        />
      </div>
      <Pagination
        pageCount={paginateInformation.totalPages}
        handlePageClick={(selected) => handlePageClick(selected)}
      />
      {isOpenAddNewUserForm && (
        <Card>
          <Table
            title="User's wallet List"
            description="Enter wallet address of user who want to join whitelist"
            header={NEW_WHITELIST_TABLE_HEADER}
            body={formatNewWhitelist(userDetails)}
          />
          <ButtonGroup buttons={newWhitelistButtons} align="center" />
        </Card>
      )}
      <ButtonGroup buttons={buttons} align="center" customStyle="mt-5" />
    </Fragment>
  );
}
