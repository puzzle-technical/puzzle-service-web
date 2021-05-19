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

export default function RouterView() {
  const userhasdata = useSelector(userHasData)
  const user = useSelector(getUser)
  const token = useSelector(getToken)
  const [isTokenValid, setIsTokenValid] = useState()
  
  // PATHS
  const mainPath = '/'
  const loginPath = '/login'
  const singUpPath = '/signUp'
  const signUpParamPath = '/signUp/:type'
  const userPath = '/user'
  const adminPath = '/admin'
  
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
      <Route exact path={loginPath}>
        { 
          isTokenValid && userhasdata
            ? <Redirect to={userPath}/>
            : <div>Login</div>
        }
      </Route>

      <Route exact path={[singUpPath, signUpParamPath]}>
        <div>Sign up</div>
      </Route>
      
      <Route path={userPath}>
        { 
          !userhasdata || !isTokenValid
            ? <Redirect to={loginPath}/>
            : user.tipoUser == 'provider'
              ? <ProviderRouter/>
              : <UserRouter/>
        }
      </Route>

      <Route exact path={adminPath}>
        <AdminRouter/>
      </Route>

      <Route path={mainPath}>
        <MainRouter/>
      </Route>

    </Switch>
  </Router>
}
