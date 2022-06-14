import React, { useState, useContext, useEffect } from "react";
import Swal from 'sweetalert'

import { AuthContext } from "../../context/auth.context";

import authAPI from "../../apis/auth";
import LoginForm from "../../components/LoginForm/LoginForm";


const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setAuthLogin, setCurrentUser } = useContext(AuthContext);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const user = await authAPI.Login({username, password});
      const start = Date.now();
      const end = start + parseInt(process.env.REACT_APP_LOGIN_TIME);
      localStorage.setItem('user', JSON.stringify({user, start: start, end: end}));
      setCurrentUser(user)
      setAuthLogin(true);
    } catch (e) {
      Swal({
        title: 'Error',
        text: 'Login failed !',
        icon: 'error',
        confirmButtonText: 'Close'
      })
    }
  };



  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <LoginForm
                showLogo={true}
                title="Hello! let's get started"
                description="Sign in to continue."
                username={username}
                password={password}
                onChange={handleInputChange}
                submit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
