import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert";

import Table from "../../components/Table/Table";
import ButtonGroup from "../../components/ButtonGroup/ButtonGroup";

import { CREATE_USER } from "../../utils/apiPaths";
import {
  NEW_USER_TABLE_HEADER,
  formatNewUsers,
} from "../../utils/tableListUtil";
import { isAllInputNotNull } from "../../utils/inputUtil";

const NewUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const defaultUserDetail = {
    id: 0,
    address: "",
    email: "",
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
      return {
        Address: user.address,
        Email: user.email,
      };
    });
    console.log("json arr: ", jsonArr);
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
          CREATE_USER(),
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
            text: "Create new user successfully !",
            icon: "success",
          }).then((ok) => {
            if (ok) {
              navigate("/users");
            }
          });
        })
        .catch((err) => {
          console.log("create user err: ", err.response);
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
          navigate("/appliedProjects");
        }
      });
    } else navigate(-1);
  };

  const buttons = [
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

  return (
    <div className="row">
      <div className="col-lg-12 grid-margin stretch-card">
        <Table
          title="User List"
          description=""
          header={NEW_USER_TABLE_HEADER}
          body={formatNewUsers(userDetails)}
          loading={loading}
        />
      </div>
      <div className="col-lg-12 grid-margin stretch-card">
        <ButtonGroup buttons={buttons} align="center" />
      </div>
    </div>
  );
};

export default NewUser;
