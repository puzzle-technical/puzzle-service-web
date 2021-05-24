import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getToken } from '../store/selectors/sessionSelectors'
import { getUser } from '../store/selectors/userSelectors'
import { Redirect, BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { verifyUserAuth } from "../services/auth";

import SignUp from '../pages/signUp'
import Login from "../pages/login";
import LoadingPage from '../components/loading/loadingPage'

import MainRouter from './main';
import UserRouter from './user';
import ProviderRouter from './provider';
import AdminRouter from './admin';

export default function RouterView() {
  const [loading, setLoading] = useState(true)
  const token = useSelector(getToken)
  const user = useSelector(getUser)
  const [isTokenValid, setIsTokenValid] = useState()

  const userHasData = () => user && user != {}
  
  useEffect(() => {
    const verify = async () => {
      let verify = false
      if (user && user != {})
        verify = await verifyUserAuth(token)
      setIsTokenValid(verify)
      setLoading(false)
    }
    verify()
  }, [token, user])

  const routerComponent = <Router>
    <Switch>
      <Route exact path="/login">
        { loading ? <LoadingPage/> :
            isTokenValid && userHasData() ?
              <Redirect to="/user"/> :
              <Login/>
        }
      </Route>

      <Route exact path={["/signUp/:type", "/signUp"]}>
        <SignUp/>
      </Route>
      
      <Route path="/user">
        { loading ? <LoadingPage/> :
          !userHasData() || !isTokenValid ?
            <Redirect to="/login"/> :
            user.tipoUser == 'provider' ?
              <ProviderRouter user={user}/> :
              <UserRouter/>
        }
      </Route>

      <Route path="/admin-puzzle">
        <AdminRouter/>
      </Route>

      <Route path="/">
        <MainRouter/>
      </Route>

    </Switch>
  </Router>

  return routerComponent
}
