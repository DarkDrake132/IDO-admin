import Card from "../Card/Card";
import FormGroup from "../FormGroup/FormGroup";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import Label from "../ui/Label/Label";

const PoolForm = ({
  //form attributes
  poolStatus,
  //
  projectDetails,
  setProjectDetails,
  //
  poolDetails,
  setPoolDetails,
  //
  scopeDetails,
  setScopeDetails,
  //
  whitelistDetails,
  setWhitelistDetails,
  //
  saleDetails,
  setSaleDetails,
  //
  otherDetails,
  setOtherDetails,
  //
  readOnly,
  setHasChanged,
  //buttons control attributes
  buttons,
}) => {
  // function for handling changes for pool inputs
  const handlePoolChange = (e, setDetails) => {
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

  const topRightLabel = (
    <Label type={poolStatus?.labelType} text={poolStatus?.labelText} />
  );

  return (
    <div className="row">
      <form className="forms-sample">
        {/* project information section */}
        <div className="col-12 grid-margin stretch-card">
          <Card
            title="Project information"
            description={readOnly ? "" : "Edit the project detail information"}
            topRightElement={topRightLabel}
          >
            <FormGroup
              elements={projectDetails}
              isReadOnly={readOnly}
              handleChange={(e) => handlePoolChange(e, setProjectDetails)}
            />
          </Card>
        </div>

        {/* pool detail information section */}
        <div className="col-12 grid-margin stretch-card">
          <Card
            title="Pool Detail"
            description={readOnly ? "" : "Enter the pool detail information"}
          >
            <FormGroup
              elements={poolDetails}
              isReadOnly={readOnly}
              handleChange={(e) => handlePoolChange(e, setPoolDetails)}
            />
          </Card>
        </div>
        {/* whitelist detail information section */}
        <div className="col-12 grid-margin stretch-card">
          <Card
            title="Whitelist Detail"
            description={
              readOnly ? "" : "Enter the whitelist detail information"
            }
          >
            <FormGroup
              elements={whitelistDetails}
              isReadOnly={readOnly}
              handleChange={(e) => handlePoolChange(e, setWhitelistDetails)}
            />
          </Card>
        </div>
        {/* scope detail information section */}
        <div className="col-12 grid-margin stretch-card">
          <Card
            title="Pool Scope"
            description={readOnly ? "" : "Choose the pool scope"}
          >
            <FormGroup
              elements={scopeDetails}
              isReadOnly={readOnly}
              handleChange={(e) => handlePoolChange(e, setScopeDetails)}
            />
          </Card>
        </div>
        {/* sale information section */}
        <div className="col-12 grid-margin stretch-card">
          <Card
            title="Sale Information"
            description={readOnly ? "" : "Enter the sale detail information"}
          >
            <FormGroup
              elements={saleDetails}
              isReadOnly={readOnly}
              handleChange={(e) => handlePoolChange(e, setSaleDetails)}
            />
          </Card>
        </div>
        {/* other information section */}
        <div className="col-12 grid-margin stretch-card">
          <Card
            title="Other Information"
            description={
              readOnly ? "" : "Enter the other information of the project"
            }
          >
            <FormGroup
              elements={otherDetails}
              isReadOnly={readOnly}
              handleChange={(e) => handlePoolChange(e, setOtherDetails)}
            />
          </Card>
        </div>
        {/* buttons section */}
        <ButtonGroup buttons={buttons} align="center" />
      </form>
    </div>
  );
};

export default PoolForm;
