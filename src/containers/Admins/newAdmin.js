import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert";

import UserForm from "../../components/UserForm/UserForm";

import { CREATE_USER } from "../../utils/apiPaths";
import { ADMIN_DETAIL_SKELETON } from "../../utils/adminUtil";
import { isAllInputNotNull } from "../../utils/inputUtil";

const NewAdmin = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState([ADMIN_DETAIL_SKELETON]);

  const [hasChanged, setHasChanged] = useState(false);

  const validateInput = (userArr) => {
    for (let user of userArr) {
      if (!isAllInputNotNull(user)) return false;
    }
    return true;
  };

  const submitButtonOnClick = (e) => {
    e.preventDefault();
    const jsonArr = userDetails.map((user) => {
      return {
        Address: user.Address.value,
        Email: user.Email.value,
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
      // axios
      //   .post(CREATE_USER(), jsonArr)
      //   .then((res) => {
      //     Swal({
      //       title: "Success",
      //       text: "Create new user successfully !",
      //       icon: "success",
      //     }).then((ok) => {
      //       if (ok) {
      //         navigate("/users");
      //       }
      //     });
      //   })
      //   .catch((err) => {
      //     console.log("create user err: ", err.response);
      //     Swal({
      //       title: "Error!",
      //       text: "Something went wrong",
      //       icon: "error",
      //     })
      //   });
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
    }
  };

  const buttons = [
    {
      content: "Submit",
      type: "btn-primary",
      onClick: submitButtonOnClick,
    },
    {
      content: "Cancel",
      type: "btn-light",
      onClick: cancelButtonOnClick,
    },
  ];

  return (
    <UserForm
      //form details
      userDetails={userDetails}
      setUserDetails={setUserDetails}
      newUserDetail={ADMIN_DETAIL_SKELETON}
      //
      readOnly={false}
      setHasChanged={setHasChanged}
      //button controls
      buttons={buttons}
    />
  );
};

export default NewAdmin;
