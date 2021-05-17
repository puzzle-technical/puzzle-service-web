import { useState, useEffect } from 'react'
import { Route, Switch, useRouteMatch, Link, useHistory, useLocation, Redirect } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { updateUser } from '../store/actions/userActions'
import { saveToken } from '../store/actions/sessionActions'
import api from '../api'

import ProviderMain from '../pages/providerMain'
import ProviderNegotiations from '../pages/providerNegotiations'
import ProviderPoints from '../pages/providerPoints'
import ProviderServices from '../pages/providerServices'
import UserService from '../pages/userServices/singleService'
import Profile from '../pages/profile'

import { ReactComponent as PenIcon } from '../assets/icons/pen.svg'
import { ReactComponent as LogoutIcon } from '../assets/icons/logout.svg'
import puzzlePoint from '../assets/img/puzzlePoint.png'
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import UserDropDown from '../components/userDropDown';

export default function UserRouter (props) {
  const { user } = props
  const { path } = useRouteMatch()
  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()

  const mainPath = path
  const profilePath = `${path}/profile`
  const servicesPath = `${path}/services`
  const negotiationsPath = `${path}/negotiations`
  const singleServicePath = `${path}/service`
  const pointsPath = `${path}/points`

  const [selectedService, setSelectedService] = useState()
  const onSelectService = service => {
    console.log(service)
    setSelectedService(service)
    history.push(singleServicePath)
  }

  const logout = () => {
    dispatch(saveToken(undefined))
    dispatch(updateUser(undefined))
    history.push('/login')
  }
  
  useEffect(() => {
    const load = async () => {
      await api.get(`users/findById/${user.idUser}`)
      .then(res => {
        if (res.data.success) dispatch(updateUser(res.data.data))
      })
      .catch(err => console.log(err))
    }
    load()
  }, [])

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
      OFERTAS
    </Link>,
    <Link to={negotiationsPath} className={`button-simple ${location.pathname == negotiationsPath ? 'active' : ''}`}>
      NEGOCIAÇÕES
    </Link>,
    <Link to={servicesPath} className={`button-simple ${location.pathname == servicesPath ? 'active' : ''}`}>
      SERVIÇOS SALVOS
    </Link>,
    <Link to={pointsPath} className={`button-simple ${location.pathname == pointsPath ? 'active' : ''}`}>
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <img src={puzzlePoint} alt="puzzle points" width="20px"></img>
        <span>
          PUZZLE POINTS:
          <span style={{ color: "#E2A11E", fontSize: "1.1em" }}> {user.puzzlePoints || 0}</span>
        </span>
      </div>  
    </Link>,
    <UserDropDown dropdownOptions={dropdownOptions}/>
  ]
  return <div className="main-page">
    <Navbar menuOptions={menuOptions}/>
    <div className="main-page-content">
      <Switch>
        
        <Route exact path={mainPath}>
          <ProviderMain onSelectService={onSelectService}/>
        </Route>

        <Route exact path={negotiationsPath}>
          <ProviderNegotiations ></ProviderNegotiations>
        </Route>

        <Route exact path={servicesPath}>
          <ProviderServices onSelectService={onSelectService}></ProviderServices>
        </Route>

        <Route exact path={`${singleServicePath}`}>
          {
            selectedService ?  
            <UserService service={selectedService}></UserService> :
            <Redirect to={mainPath}></Redirect>
          }
        </Route>
        
        <Route exact path={pointsPath}>
          <ProviderPoints></ProviderPoints>
        </Route>

        <Route exact path={profilePath}>
          <Profile></Profile>
        </Route>

      </Switch>
    </div>
    <Footer/>
  </div>
}