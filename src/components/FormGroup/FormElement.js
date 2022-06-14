import Input from "../ui/Input/Input";
import Spinner from "../ui/Spinner/Spinner";

const FormElement = ({
  widthtype,
  label,
  element,
  isReadOnly,
  handleChange,
}) => {
  //show the length space of the input to take
  let inputLength;

  //switch the input length to show
  switch (widthtype) {
    case "full":
      inputLength = "col-md-12";
      break;
    case "half":
      inputLength = "col-md-6 half-size-input";
      break;
    default:
      inputLength = "col-md-12";
      break;
  }

  if (element.hidden) {
    return null;
  }

  let displayElement = isReadOnly ? (
    <label className="form-element-value">{element.value}</label>
  ) : (
    <Input
      //these are required
      name={element.name}
      value={element.value}
      widthtype={element.widthType}
      type={element.type}
      placeholder={element.placeholder}
      onChange={handleChange}
      //these are optional
      prependicon={element?.prependIcon}
      appendbutton={element?.appendButton}
      rows={element?.rows}
      options={element?.options}
      disabled={element?.disabled}
    />
  );

  if (element.type === "button") {
    displayElement = (
      <button
        type="button"
        className={`btn ${element.btnType}`}
        onClick={element.onClick}
        disabled={element.loading}
      >
        {element.loading && (
          <Spinner type="grow" small={true} inButton={true} />
        )}
        {element.content}
      </button>
    );
  }

  return (
    <div className={inputLength}>
      <label>{label}</label>
      <div className="input-group">{displayElement}</div>
    </div>
  );
};

export default FormElement;
