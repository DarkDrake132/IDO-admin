const Logo = props => {
  return (
    <div className={["navbar-brand-wrapper d-flex align-items-center", props.classType].join(" ")}>
      <div className="navbar-brand brand-logo"><img src="/statics/images/logo.svg" alt="logo" /></div>
      <div className="navbar-brand brand-logo-mini"><img src="/statics/images/logo-mini.svg" alt="logo" /></div>
    </div>
  );
}

export default Logo;