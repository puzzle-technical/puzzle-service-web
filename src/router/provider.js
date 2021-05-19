import { useEffect } from 'react'
import { Route, Switch, useRouteMatch, Redirect } from "react-router-dom";
import { useSelector } from 'react-redux'
import { getCurrentService } from '../store/selectors/userSelectors'
// import api from '../api'

export default function UserRouter () {
  const currentService = useSelector(getCurrentService)
  const { path } = useRouteMatch()

  // PATHS
  const mainPath = path
  const profilePath = `${path}/profile`
  const servicesPath = `${path}/services`
  const negotiationsPath = `${path}/negotiations`
  const singleServicePath = `${path}/service`
  const pointsPath = `${path}/points`
  const pointsSuccessPaymentPath = `${path}/points/success`
  
  useEffect(() => {
    // todo: load user info
  }, [])

  
  return <div>
    {/* <Navbar menuOptions={menuOptions}/> */}

    <div>
      <Switch>
        
        <Route exact path={mainPath}>
          <div>Provider main</div>
        </Route>

        <Route exact path={negotiationsPath}>
          <div>Provider negotiations</div>
        </Route>

        <Route exact path={servicesPath}>
          <div>Provider services</div>
        </Route>

        <Route exact path={`${singleServicePath}`}>
          {
            currentService
            ? <div>Provider service</div>
            : <Redirect to={mainPath}></Redirect>
          }
        </Route>
        
        <Route exact path={pointsPath}>
          <div>Points</div>
        </Route>

        <Route exact path={pointsSuccessPaymentPath}>
          <div>Points success payment</div>
        </Route>

        <Route exact path={profilePath}>
          <div>Provider profile</div>
        </Route>

      </Switch>
    </div>

    {/* <Footer/> */}
  </div>
}