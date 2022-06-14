import Spinner from "../ui/Spinner/Spinner";
/*
  Params:
    +buttons: List of button object {
      +content: content of button display
      +type: btn-{color} || btn-outline-{color} || btn-rounded-{color} || btn-inverse-{color}
        color: primary, secondary, success, danger, warning, info, light, dark, link
        (base on button style in template)
      +onClick: handle on click function
    }
    +align: 'left', 'right', 'center'
  
*/
const ButtonGroup = ({ buttons, align, customStyle }) => {
  let margin = "mr-2";
  if (align === "right") margin = "ml-2";

  return (
    <div className={`col-12 grid-margin text-${align} ${customStyle}`}>
      {buttons?.map((button, index) => (
        <button
          key={index}
          className={`btn ${button.type} ${margin}`}
          onClick={button.onClick}
          disabled={button.loading || button.disabled}
        >
          {button.loading && (
            <Spinner type="grow" small={true} inButton={true} />
          )}
          {button.content}
        </button>
      ))}
    </div>
  );
};

export default ButtonGroup;
