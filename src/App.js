import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./containers/index";
import Layout from "./hoc/Layout/Layout";
import Signin from "./containers/Authentication/Signin";
import React, { useEffect, useContext } from "react";
import { AuthProvider, AuthContext } from "./context/auth.context";
import {
  AuthMiddleware,
  IsLoginMiddleware,
} from "./middlewares/auth.middleware";
import NewProject from "./containers/NewProject/NewProject";
import AppliedProjects from "./containers/AppliedProjects";
import AppliedProjectDetail from "./containers/AppliedProjects/AppliedProjectDetail";
import NewPool from "./containers/NewPool/NewPool";
import Pools from "./containers/Pools";
import PoolDetail from "./containers/Pools/PoolDetail";
import Whitelists from "./containers/Whitelists";
import HasKYCWhitelists from "./containers/Whitelists/hasKYC";
import NewUser from "./containers/NewUser/NewUser";
import Users from "./containers/Users";

import Admins from "./containers/Admins";
import NewAdmin from "./containers/Admins/newAdmin";
import AdminDetail from "./containers/Admins/AdminDetail";

function App() {
  let user = JSON.parse(localStorage.getItem("user"));
  const admin = user?.user.user.Username;
  const { setAuthLogin, setCurrentUser, } = useContext(AuthContext);

  useEffect(()=> {
    const deleteUser = () => {
      const isUser = JSON.parse(localStorage.getItem("user"));
      if(isUser){
        if(isUser?.end <= Date.now()){
          setAuthLogin(false);
          setCurrentUser(null)
          localStorage.removeItem('user');
        }
      }
    }
    const interval = setInterval(() => {
      deleteUser();
    }, 180000);
   return () => clearInterval(interval);
  },[])

  return (
    <div>
      {admin === "admin" ? (
        <Router>
          <Layout>
            <Routes>
              <Route
                path="/login"
                element={
                  <IsLoginMiddleware>
                    <Signin />
                  </IsLoginMiddleware>
                }
              />
              <Route
                path="/"
                element={
                  <AuthMiddleware>
                    <Home />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/admins"
                element={
                  <AuthMiddleware>
                    <Admins />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/new-admin"
                element={
                  <AuthMiddleware>
                    <NewAdmin />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/admins/:username"
                element={
                  <AuthMiddleware>
                    <AdminDetail />
                  </AuthMiddleware>
                }
              />
            </Routes>
          </Layout>
        </Router>
      ) : (
        <Router>
          <Layout>
            <Routes>
              <Route
                path="/login"
                element={
                  <IsLoginMiddleware>
                    <Signin />
                  </IsLoginMiddleware>
                }
              />
              <Route
                path="/"
                element={
                  <AuthMiddleware>
                    <Home />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/newProject"
                element={
                  <AuthMiddleware>
                    <NewProject />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/appliedProjects"
                element={
                  <AuthMiddleware>
                    <AppliedProjects />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/appliedProjects/:projectId"
                element={
                  <AuthMiddleware>
                    <AppliedProjectDetail />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/pools"
                element={
                  <AuthMiddleware>
                    <Pools />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/pools/:poolId"
                element={
                  <AuthMiddleware>
                    <PoolDetail />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/pools/:poolId/whitelist"
                element={
                  <AuthMiddleware>
                    <Whitelists />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/pools/:poolId/hasKYCwhitelist"
                element={
                  <AuthMiddleware>
                    <HasKYCWhitelists />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/newPool/:projectId"
                element={
                  <AuthMiddleware>
                    <NewPool />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/users"
                element={
                  <AuthMiddleware>
                    <Users />
                  </AuthMiddleware>
                }
              />
              <Route
                path="/newUser"
                element={
                  <AuthMiddleware>
                    <NewUser />
                  </AuthMiddleware>
                }
              />
              <Route
                path="*"
                element={
                  <AuthMiddleware>
                    <Home />
                  </AuthMiddleware>
                }
              />
            </Routes>
          </Layout>
        </Router>
      )}
    </div>
  );
}

export default App;
