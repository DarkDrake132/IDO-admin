import { useState, useEffect } from "react";

import Card from "../Card/Card";
import FormGroup from "../FormGroup/FormGroup";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import Label from "../ui/Label/Label";

import { getProjectStatusLabel } from "../../utils/projectUtil";

//default this component is for create new Project
//When access from read detail project, this component will be a read only project component with the project information
const ProjectForm = ({
  //form attributes
  projectStatus,
  projectDetails,
  setProjectDetails,
  ownerDetails,
  setOwnerDetails,
  //display attributes
  readOnly,
  setHasChanged,
  //button group attributes
  primaryButtons,
  secondaryButtons,
}) => {
  const [statusLabel, setStatusLabel] = useState({});

  // function for handling changes for project inputs
  const handleProjectChange = (e, setDetails) => {
    const { name, value } = e.target;
    setDetails((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value: value,
      },
    }));
    setHasChanged(true);
  };

  useEffect(() => {
    setStatusLabel(getProjectStatusLabel(projectStatus));
  }, [projectStatus]);

  const topRightLabel = (
    <Label type={statusLabel.labelType} text={statusLabel.labelText} />
  );

  return (
    <div className="row">
      <form className="forms-sample">
        {/* project information section */}
        <div className="col-12 grid-margin stretch-card">
          <Card
            title="Project information"
            description={readOnly ? "" : "Enter the project detail information"}
            topRightElement={topRightLabel}
          >
            <FormGroup
              elements={projectDetails}
              isReadOnly={readOnly}
              handleChange={(e) => handleProjectChange(e, setProjectDetails)}
            />
          </Card>
        </div>

        {/* personal information section */}
        <div className="col-12 grid-margin stretch-card">
          <Card
            title="Project Owner Personal Information"
            description={
              readOnly ? "" : "Enter the personal information of project owner"
            }
          >
            <FormGroup
              elements={ownerDetails}
              isReadOnly={readOnly}
              handleChange={(e) => handleProjectChange(e, setOwnerDetails)}
            />
          </Card>
        </div>
        {/* buttons section */}
        <ButtonGroup
          buttons={readOnly ? primaryButtons : secondaryButtons}
          align="center"
        />
      </form>
    </div>
  );
};

export default ProjectForm;
