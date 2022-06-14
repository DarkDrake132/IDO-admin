const Card = props => {
  return (
    <div className={["card", props.theme].join(" ")}>
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h4>{props.title}</h4>
            <p className="card-description">{props.description}</p>
          </div>
          {props.topRightElement}
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default Card;