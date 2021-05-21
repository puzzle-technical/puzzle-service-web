import { Switch, Route, Link, useLocation, Redirect } from "react-router-dom";
import { useSelector } from 'react-redux'
import { getUser, getCurrentService } from '../store/selectors/userSelectors'
import { userBasePath, userCreateServicePath, userEditServicePath, userViewServicePath, userProfilePath } from './paths'

import UserMain from '../pages/user/main'

import Navbar from '../components/navbar'
import Footer from '../components/footer'
import DropdownUser from '../components/dropdownUser'
import { ReactComponent as PenIcon } from '../assets/icons/pen.svg'
import { ReactComponent as LogoutIcon } from '../assets/icons/logout.svg'

export default function UserRouter () {
  const user = useSelector(getUser)
  const currentService = useSelector(getCurrentService)
  const { pathname } = useLocation()
  
  const navbar = <Navbar>
    <div className="navbar-item">
      <Link to={userCreateServicePath}>
        <div className={`menu-tab ${pathname == userCreateServicePath ? 'is-active' : ''}`}>Novo serviço</div>
      </Link>
    </div>
    <div className="navbar-item">
      <Link to={userBasePath}>
        <div className={`menu-tab ${pathname == userBasePath ? 'is-active' : ''}`}>Negociações</div>
      </Link>
    </div>
    <DropdownUser user={user}>
      <div className="navbar-item">
        <Link className="is-flex is-align-items-center is-justify-content-center" to={userProfilePath}>
          <span className="icon is-small  is-hidden-mobile">
            <PenIcon width={20}></PenIcon>
          </span>
          <span className={`ml-2 menu-tab ${pathname == userProfilePath ? 'is-active' : ''}`}>Minha conta</span>
        </Link>
      </div>
      <div className="navbar-item">
        <Link className="is-flex is-align-items-center is-justify-content-center" to={''} onClick={() => { /* logout */ }}>
          <span className="icon is-small  is-hidden-mobile">
            <LogoutIcon width={20}></LogoutIcon>
          </span>
          <span className="ml-2">Sair</span>
        </Link>
      </div>
    </DropdownUser>
  </Navbar>

  return <div className="navbar-page">
    {navbar}

    <div className="navbar-page-content">
      <Switch>

        <Route exact path={userBasePath}>
          <UserMain/>
        </Route>

        <Route exact path={userCreateServicePath}>
          <div>Create Service</div>
        </Route>


        <Route exact path={`${userViewServicePath}`}>
          {
            currentService
              ? <div>Current service</div>
              : <Redirect to={userBasePath}></Redirect>
          }
        </Route>

        <Route exact path={`${userEditServicePath}`}>
          {
            currentService
            ? <div>Edit service</div>
            : <Redirect to={userBasePath}></Redirect>
          }
        </Route>

        <Route exact path={userProfilePath}>
          <div>Profile</div>
        </Route>

      </Switch>
    </div>

    <Footer/>
  </div>
}