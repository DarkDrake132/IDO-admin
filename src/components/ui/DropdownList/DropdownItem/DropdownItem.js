

function DropdownItem(props) {

  return (
    <a className="dropdown-item preview-item">
      <div className="preview-thumbnail">
        <div className={"preview-icon " + props.bgIcon}>
          <i className="ti-info-alt mx-0"></i>
        </div>
      </div>
      <div className="preview-item-content">
        <h6 className="preview-subject font-weight-normal">{props.subject}</h6>
        <p className="font-weight-light small-text mb-0 text-muted">
          {props.content}
        </p>
      </div>
    </a>
  );
}
export default DropdownItem;