import { Route, Switch, useRouteMatch, Link, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { updateUser } from '../store/actions/userActions'
import { saveToken } from '../store/actions/sessionActions'

import UserMain from '../pages/userMain'

import { ReactComponent as PenIcon } from '../assets/icons/pen.svg'
import { ReactComponent as LogoutIcon } from '../assets/icons/logout.svg'

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import UserDropDown from '../components/userDropDown';

export default function UserRouter () {
  const { path } = useRouteMatch()
  const history = useHistory()
  const dispatch = useDispatch()

  const logout = () => {
    dispatch(saveToken(undefined))
    dispatch(updateUser(undefined))
    history.push('/login')
  }

  const dropdownOptions = [
    <Link to="/">
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
    <Link to="/" className="button-simple" style={{ paddingBottom: '10px', borderBottom: '2px solid var(--secondary)' }}>NOVO SERVIÇO</Link>,
    <Link to="/" className="button-simple" style={{ paddingBottom: '10px' }}>NEGOCIAÇÕES</Link>,
    <UserDropDown dropdownOptions={dropdownOptions}/>
  ]

  return <div className="main-page">
    <Navbar menuOptions={menuOptions}/>
    <div className="main-page-content">
      <Switch>

        <Route exact path={path}>
          <UserMain/>
        </Route>

        <Route exact path={`${path}/services`}>
          <h1>user services</h1>
        </Route>

      </Switch>
    </div>
    <Footer/>
  </div>
}