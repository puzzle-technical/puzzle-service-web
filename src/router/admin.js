import { useState, useEffect } from 'react'
import { Route, Switch, useRouteMatch, Link, useHistory, useLocation, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { getAdminToken } from '../store/selectors/sessionSelectors'
import { getAdminUser } from '../store/selectors/userSelectors'
import { verifyAdminUserAuth } from "../services/auth";

import LoginAdmin from '../pages/loginAdmin'

export default function UserRouter () {
  const { path } = useRouteMatch()
  const adminToken = useSelector(getAdminToken)
  const adminUser = useSelector(getAdminUser)
  const [isTokenValid, setIsTokenValid] = useState()

  const userHasData = () => adminUser && adminUser != {}

  useEffect(() => {
    console.log(`${path}/login`);
    const verify = async () => {
      let verify = false
      if (userHasData())
        verify = await verifyAdminUserAuth(adminToken)
      setIsTokenValid(verify)
    }
    verify()
  }, [adminToken])

  return <Switch>

    <Route exact path={path}>
      { !userHasData() || !isTokenValid ?
          <Redirect to={`${path}/login`}/> :
          <h1>Admin</h1>
      }
    </Route>

    <Route exact path={`${path}/login`}>
      { isTokenValid && userHasData() ?
        <Redirect to={path}/> :
        <LoginAdmin/>
      }
    </Route>
  </Switch>
}