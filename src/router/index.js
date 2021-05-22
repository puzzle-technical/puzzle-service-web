import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getToken } from '../store/selectors/sessionSelectors'
import { getUser, userHasData } from '../store/selectors/userSelectors'
import { Redirect, BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { verifyUserAuth } from "../services/auth";

// ROUTES
import MainRouter from './main';
import UserRouter from './user';
import ProviderRouter from './provider';
import AdminRouter from './admin';

// COMPONENTS
import Login from '../pages/login'
import Signup from '../pages/signup'

//PATHS
import { adminBasePath, loginBasePath, mainBasePath, singupBasePath, singupParamPath, userBasePath } from "./paths";

export default function RouterView() {
  const userhasdata = useSelector(userHasData)
  const user = useSelector(getUser)
  const token = useSelector(getToken)
  const [isTokenValid, setIsTokenValid] = useState()
  
  useEffect(() => {
    const verify = async () => {
      let verify = false
      if (userhasdata) verify = await verifyUserAuth(token)
      setIsTokenValid(verify)
    }
    verify()
  }, [token, userhasdata])

  return <Router>
    <Switch>
      <Route exact path={loginBasePath}>
        { 
          isTokenValid && userhasdata
            ? <Redirect to={userBasePath}/>
            : <Login/>
        }
      </Route>

      <Route exact path={[singupBasePath, singupParamPath]}>
        <Signup/>
      </Route>
      
      <Route path={userBasePath}>
        { 
          !userhasdata || !isTokenValid
            ? <Redirect to={loginBasePath}/>
            : user.tipoUser == 'provider'
              ? <ProviderRouter/>
              : <UserRouter/>
        }
      </Route>

      <Route exact path={adminBasePath}>
        <AdminRouter/>
      </Route>

      <Route path={mainBasePath}>
        <MainRouter/>
      </Route>

    </Switch>
  </Router>
}
