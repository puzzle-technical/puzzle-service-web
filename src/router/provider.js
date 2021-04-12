import { Route, Switch, useRouteMatch, Link, useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { updateUser } from '../store/actions/userActions'
import { saveToken } from '../store/actions/sessionActions'

import ProviderMain from '../pages/providerMain'

import { ReactComponent as PenIcon } from '../assets/icons/pen.svg'
import { ReactComponent as LogoutIcon } from '../assets/icons/logout.svg'
import puzzlePoint from '../assets/img/puzzlePoint.png'
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import UserDropDown from '../components/userDropDown';

export default function UserRouter (props) {
  const { user } = props
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
    <Link to={path} className="button-simple" style={{ paddingBottom: '5px', borderBottom: '2px solid var(--secondary)' }}>OFERTAS</Link>,
    <Link to={`${path}/services`} className="button-simple">NEGOCIAÇÕES</Link>,
    <button className="button-simple">
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <img src={puzzlePoint} alt="puzzle points" width="20px"></img>
        <span>
          PUZZLE POINTS:
          <span style={{ color: "#E2A11E", fontSize: "1.1em" }}> {user.puzzlePoints || 0}</span>
        </span>
      </div>  
    </button>,
    <UserDropDown dropdownOptions={dropdownOptions}/>
  ]

  return <div className="main-page">
    <Navbar menuOptions={menuOptions}/>
    <div className="main-page-content">
      <Switch>

        <Route exact path={path}>
          <ProviderMain user={user}/>
        </Route>

        <Route exact path={`${path}/services`}>
          <h1>provider services</h1>
        </Route>

      </Switch>
    </div>
    <Footer/>
  </div>
}