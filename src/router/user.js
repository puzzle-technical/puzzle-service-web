import { Route, Switch, useRouteMatch, Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { updateUser } from '../store/actions/userActions'
import { saveToken } from '../store/actions/sessionActions'

import UserMain from '../pages/userMain'
import Profile from '../pages/profile'

import { ReactComponent as PenIcon } from '../assets/icons/pen.svg'
import { ReactComponent as LogoutIcon } from '../assets/icons/logout.svg'

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import UserDropDown from '../components/userDropDown';

export default function UserRouter () {
  const { path } = useRouteMatch()
  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()

  const logout = () => {
    dispatch(saveToken(undefined))
    dispatch(updateUser(undefined))
    history.push('/login')
  }

  const mainPath = path
  const profilePath = `${path}/profile`
  const businessPath = `${path}/services`

  const dropdownOptions = [
    <Link to={profilePath}>
      <span className="option">
        <PenIcon width={20} height={18} color="inherit" /> Minha conta
      </span>
    </Link>,
    <span onClick={logout}>
      <span className="option">
        <LogoutIcon width={20} height={20} color="inherit" /> Sair
      </span>
    </span>
  ]

  const menuOptions = [
    <Link to={mainPath} className={`button-simple ${location.pathname == mainPath ? 'active' : ''}`}>
      NOVO SERVIÇO
    </Link>,
    <Link to={businessPath} className={`button-simple ${location.pathname == businessPath ? 'active' : ''}`}>
      NEGOCIAÇÕES
    </Link>,
    <UserDropDown dropdownOptions={dropdownOptions}/>
  ]

  return <div className="main-page">
    <Navbar menuOptions={menuOptions}/>
    <div className="main-page-content">
      <Switch>

        <Route exact path={mainPath}>
          <UserMain/>
        </Route>

        <Route exact path={businessPath}>
          <h1>user services</h1>
        </Route>

        <Route exact path={profilePath}>
          <Profile></Profile>
        </Route>

      </Switch>
    </div>
    <Footer/>
  </div>
}