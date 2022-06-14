import { Fragment } from "react";

const displayPrependIcon = (prependIcon) => {
  switch (prependIcon) {
    case "dollar":
      return (
        <div className="input-group-prepend">
          <span className="input-group-text bg-primary text-white">$</span>
        </div>
      );
    default:
      return null;
  }
};

const displayInputField = (props) => {
  switch (props.type) {
    default:
    case "text":
    case "date": {
      return <input className="form-control" {...props} />;
    }
    case "textarea": {
      return <textarea className="form-control" {...props} />;
    }
    case "select": {
      return (
        <select className="form-control" {...props}>
          {props?.options.map((network, index) => {
            return <option key={index}>{network}</option>;
          })}
        </select>
      );
    }
    case "radios": {
      const options = props.options;
      const handleRadioCheck = (value) => {
        const event = {
          target: {
            name: "Scope",
            value: value,
          },
        };
        props.onChange(event);
      };
      return options.map((option, index) => {
        return (
          <div className="col-sm-4" key={index}>
            <div className="form-check">
              <label className="form-check-label">
                <input
                  type="radio"
                  className="form-check-input"
                  {...option}
                  onChange={() => handleRadioCheck(option.value)}
                />
                {option.label}
                <i className="input-helper"></i>
              </label>
            </div>
          </div>
        );
      });
    }
    case "checkbox": {
      return <input className="form-control form-check-input" {...props} />;
    }
  }
};

const displayAppendButton = (appendButton) => {
  switch (appendButton) {
    case "telegram":
      return (
        <div className="input-group-append">
          <button className="btn btn-sm btn-facebook" type="button">
            <i className="fa fa-telegram"></i>
          </button>
        </div>
      );
    case "twitter":
      return (
        <div className="input-group-append">
          <button className="btn btn-sm btn-facebook" type="button">
            <i className="ti-twitter"></i>
          </button>
        </div>
      );
    default:
      return null;
  }
};

const Input = (props) => {
  return (
    <Fragment>
      {displayPrependIcon(props.prependicon)}
      {displayInputField(props)}
      {displayAppendButton(props.appendbutton)}
    </Fragment>
  );
};

export default Input;
