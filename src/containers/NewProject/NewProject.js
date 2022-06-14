import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert";

import ProjectForm from "../../components/ProjectForm/ProjectForm";

import { CREATE_APPLIED_PROJECT } from "../../utils/apiPaths";
import {
  PROJECT_DETAIL_SKELETON,
  OWNER_DETAIL_SKELETON,
  getDevelopmentStateValue,
} from "../../utils/projectUtil";
import { getChainId } from "../../utils/networkUtil";
import { isAllInputNotNull } from "../../utils/inputUtil";

const NewProject = () => {
  const navigate = useNavigate();
  const [projectDetails, setProjectDetails] = useState(PROJECT_DETAIL_SKELETON);
  const [ownerDetails, setOwnerDetails] = useState(OWNER_DETAIL_SKELETON);

  const [hasChanged, setHasChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitButtonOnClick = (e) => {
    e.preventDefault();
    setLoading(true);
    const jsonObj = {
      PersonalName: ownerDetails.PersonalName.value,
      PersonalEmail: ownerDetails.PersonalEmail.value,
      PersonalTelegram: ownerDetails.PersonalTelegram.value,
      ProjectName: projectDetails.ProjectName.value,
      Description: projectDetails.Description.value,
      Website: projectDetails.Website.value,
      Twitter: projectDetails.Twitter.value,
      Telegram: projectDetails.Telegram.value,
      ChainId: getChainId(projectDetails.NetworkChain.value),
      DevelopmentState: getDevelopmentStateValue(
        projectDetails.DevelopmentState.value
      ),
      Whitepaper: projectDetails.Whitepaper.value,
      Tokenomic: projectDetails.Tokenomic.value,
      BeforeRaise: projectDetails.BeforeRaise.value,
      TotalRaise: projectDetails.TotalRaise.value,
      //
    };
    //console.log("jsonObj detail: ", jsonObj);
    if (!isAllInputNotNull(jsonObj)) {
      Swal({
        title: "Error",
        text: "Input must not be null !",
        icon: "error",
      });
      setLoading(false);
    } else {
      axios
        .post(CREATE_APPLIED_PROJECT(), jsonObj, {
          headers: {
            Authorization: JSON.parse(localStorage.getItem("user"))?.user.token,
            User: JSON.parse(localStorage.getItem("user"))?.user.user.Username,
          },
        })
        .then((res) => {
          Swal({
            title: "Success",
            text: "Create new project successfully !",
            icon: "success",
          }).then((ok) => {
            if (ok) {
              navigate("/appliedProjects");
            }
          });
          setLoading(false);
        })
        .catch((err) => {
          console.log("create project err: ", err.response);
          Swal({
            title: "Error!",
            text: "Something went wrong",
            icon: "error",
          });
          setLoading(false);
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
    }
  };

  const buttons = [
    {
      content: "Submit",
      type: "btn-primary",
      onClick: submitButtonOnClick,
      loading: loading
    },
    {
      content: "Cancel",
      type: "btn-light",
      onClick: cancelButtonOnClick,
    },
  ];

  return (
    <ProjectForm
      //form details
      projectDetails={projectDetails}
      setProjectDetails={setProjectDetails}
      ownerDetails={ownerDetails}
      setOwnerDetails={setOwnerDetails}
      //
      readOnly={false}
      setHasChanged={setHasChanged}
      //button controls
      secondaryButtons={buttons}
    />
  );
};

export default NewProject;
