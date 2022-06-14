import Logo from "../ui/Logo/Logo";
import Input from "../ui/Input/Input";

const LoginForm = ({
  showLogo,
  title,
  description,
  username,
  password,
  submit,
  onChange,
}) => {
  return (
    <div className="auth-form-light text-left py-5 px-4 px-sm-5">
      {showLogo && <Logo />}
      <h4>{title}</h4>
      <h6 className="font-weight-light">{description}</h6>
      <form className="pt-3" onSubmit={submit}>
        <div className="form-group">
          <Input
            name="username"
            placeholder="Username"
            value={username}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
          />
        </div>
        <div className="pt-3">
          <button type="submit" className="btn btn-primary sign-in-btn">
            SIGN IN
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
