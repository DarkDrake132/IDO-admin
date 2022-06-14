import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert";
import axios from "axios";

import ProjectForm from "../../components/ProjectForm/ProjectForm";
import {
  PROJECT_DETAIL_SKELETON,
  OWNER_DETAIL_SKELETON,
  UpdateInfoToSkeleton,
  getDevelopmentStateValue,
} from "../../utils/projectUtil";
import {
  GET_APPLIED_PROJECT_BY_ID,
  UPDATE_APPLIED_PROJECT,
  DELETE_APPLIED_PROJECT,
} from "../../utils/apiPaths";
import { isAllInputNotNull } from "../../utils/inputUtil";
import { getChainId } from "../../utils/networkUtil";
import appliedProjectAPI from "../../apis/appliedProject";

const AppliedProjectDetail = () => {
  const navigate = useNavigate();
  const [projectId] = useState(useParams().projectId);
  const initialData = useRef(); // initial state to save data after first time fetching API, this data is used to restore state when cancel input change
  const [projectDetails, setProjectDetails] = useState(PROJECT_DETAIL_SKELETON);
  const [ownerDetails, setOwnerDetails] = useState(OWNER_DETAIL_SKELETON);
  const [projectStatus, setProjectStatus] = useState("");

  const [readOnly, setReadOnly] = useState(true);
  const [hasChanged, setHasChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

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
        console.log("applied project detail: ", res.data);
        //console.log('get project res: ', res.data);
        setProjectStatus(res.data.Status);
        //save data first fetching to initial
        initialData.current = {
          projectDetails: UpdateInfoToSkeleton(
            PROJECT_DETAIL_SKELETON,
            res.data
          ),
          ownerDetails: UpdateInfoToSkeleton(OWNER_DETAIL_SKELETON, res.data),
        };
        //after call API, set the fetched data to project detail and owner detail
        setProjectDetails(
          UpdateInfoToSkeleton(PROJECT_DETAIL_SKELETON, res.data)
        );
        setOwnerDetails(UpdateInfoToSkeleton(OWNER_DETAIL_SKELETON, res.data));
      })
      .catch((err) => {
        setError(true);
        console.log("get project err: ", err);
      });
  }, [projectId, initialData]);

  //buttons onclick event handler
  const submitButtonOnClick = (e) => {
    e.preventDefault();
    // handle api call here
    if (!hasChanged) {
      setReadOnly(true);
    } else {
      const jsonObj = {
        Id: projectId,
        PersonalName: ownerDetails.PersonalName.value,
        PersonalEmail: ownerDetails.PersonalEmail.value,
        PersonalTelegram: ownerDetails.PersonalTelegram.value,
        ProjectName: projectDetails.ProjectName.value,
        Description: projectDetails.Description.value,
        Website: projectDetails.Website.value,
        Twitter: projectDetails.Twitter.value,
        Telegram: projectDetails.Telegram.value,
        DevelopmentState: getDevelopmentStateValue(
          projectDetails.DevelopmentState.value
        ),
        ChainId: getChainId(projectDetails.NetworkChain.value),
        Whitepaper: projectDetails.Whitepaper.value,
        Tokenomic: projectDetails.Tokenomic.value,
        BeforeRaise: projectDetails.BeforeRaise.value,
        TotalRaise: projectDetails.TotalRaise.value,
        //
      };
      if (!isAllInputNotNull(jsonObj)) {
        //console.log('jsonObj detail: ', jsonObj)
        Swal({
          title: "Error",
          text: "Input must not be null !",
          icon: "error",
        });
      } else {
        console.log("jsonObj detail: ", jsonObj);
        setIsLoading(true);
        axios
          .patch(UPDATE_APPLIED_PROJECT(projectId), jsonObj, {
            headers: {
              Authorization: JSON.parse(localStorage.getItem("user"))?.user
                .token,
              User: JSON.parse(localStorage.getItem("user"))?.user.user
                .Username,
            },
          })
          .then((res) => {
            setIsLoading(false);
            Swal({
              title: "Success",
              text: "Information has been saved",
              icon: "success",
            });
            setHasChanged(false);
            setReadOnly(true);
            console.log("update res: ", res);
          })
          .catch((err) => {
            setIsLoading(false);
            Swal({
              title: "Error!",
              text: "Something went wrong",
              icon: "error",
            });
            console.log("update err: ", err);
          });
      }
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
          // restore state value to the initial data
          setProjectDetails(initialData.current.projectDetails);
          setOwnerDetails(initialData.current.ownerDetails);
          setHasChanged(false);
          setReadOnly(true);
        }
      });
    } else {
      setReadOnly(true);
    }
  };
  const updateButtonOnClick = (e) => {
    e.preventDefault();
    //console.log('update button clicked !')
    setReadOnly(false);
  };

  const createButtonOnClick = (e) => {
    e.preventDefault();
    navigate(`/newPool/${projectId}`);
  };

  // soft delete
  const deleteButtonOnClick = async (e) => {
    e.preventDefault();
    const willDelete = await Swal({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    //if user click ok then handle this
    if(willDelete){
      try {
        appliedProjectAPI.deleteAppliedProject(projectId);
        navigate(-1);
      }
      catch(err){
        console.log(err.message);
      }
    }
    
    //handle resolve and reject
  };

  const buttonsBeforeUpdate = [
    {
      content: "Delete",
      type: "btn-danger",
      onClick: deleteButtonOnClick,
    },
    {
      content: "Create pool",
      type: "btn-success",
      onClick: createButtonOnClick,
    },
    {
      content: "Update",
      type: "btn-primary",
      onClick: updateButtonOnClick,
    },
  ];

  const buttonsAfterUpdate = [
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
  // errors happened, it can be the poolId does not exist or call API fail
  if (error) return <div>Project not found</div>;
  else
    return (
      <ProjectForm
        //form details
        projectStatus={projectStatus}
        projectDetails={projectDetails}
        setProjectDetails={setProjectDetails}
        ownerDetails={ownerDetails}
        setOwnerDetails={setOwnerDetails}
        //
        readOnly={readOnly}
        setHasChanged={setHasChanged}
        //button controls
        primaryButtons={buttonsBeforeUpdate}
        secondaryButtons={buttonsAfterUpdate}
      />
    );
};

export default AppliedProjectDetail;
