import { useState, useEffect } from 'react'
import {
  Route,
  Switch,
  useRouteMatch,
  Link,
  useHistory,
  useLocation,
  Redirect,
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../store/selectors/userSelectors'
import { updateUser } from '../store/actions/userActions'
import { saveToken } from '../store/actions/sessionActions'
import api from '../api'

import UserCreateService from '../pages/userCreateService'
import UserServices from '../pages/userServices'
import UserService from '../pages/userServices/singleService'
import EditService from '../pages/userServices/editService'
import Profile from '../pages/profile'

import { ReactComponent as PenIcon } from '../assets/icons/pen.svg'
import { ReactComponent as LogoutIcon } from '../assets/icons/logout.svg'

import Navbar from '../components/navbar'
import Footer from '../components/footer'
import UserDropDown from '../components/userDropDown'
import Notifications from '../components/notifications'

export default function UserRouter() {
  const user = useSelector(getUser)
  const { path } = useRouteMatch()
  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()

  const logout = () => {
    dispatch(saveToken(undefined))
    dispatch(updateUser(undefined))
    history.push('/login')
  }

  useEffect(() => {
    const load = async () => {
      await api
        .get(`users/findById/${user.idUser}`)
        .then((res) => {
          if (res.data.success) dispatch(updateUser(res.data.data))
        })
        .catch((err) => console.log(err))
    }
    load()
  }, [])

  const mainPath = path
  const profilePath = `${path}/profile`
  const createServicePath = `${path}/createService`
  const singleServicePath = `${path}/service`
  const editServicePath = `${path}/editService`

  const [selectedService, setSelectedService] = useState()
  const onSelectService = (service) => {
    console.log(service)
    setSelectedService(service)
    history.push(singleServicePath)
  }

  const dropdownOptions = [
    <Notifications dontClose/>,
    <Link to={profilePath}>
      <span className='option'>
        <PenIcon width={20} height={18} color='inherit' /> Minha conta
      </span>
    </Link>,
    <span onClick={logout}>
      <span className='option'>
        <LogoutIcon width={20} height={20} color='inherit' /> Sair
      </span>
    </span>,
  ]

  const menuOptions = [
    <Link
      to={createServicePath}
      className={`button-simple ${
        location.pathname == createServicePath ? 'active' : ''
      }`}
    >
      PROPOR SERVIÇO
    </Link>,
    <Link
      to={mainPath}
      className={`button-simple ${
        [mainPath, singleServicePath, editServicePath].indexOf(
          location.pathname
        ) >= 0
          ? 'active'
          : ''
      }`}
    >
      NEGOCIAÇÕES
    </Link>,
    <UserDropDown dropdownOptions={dropdownOptions}/>,
  ]

  return (
    <div className='main-page'>
      <Navbar menuOptions={menuOptions} />
      <div className='main-page-content'>
        <Switch>
          <Route exact path={createServicePath}>
            <UserCreateService />
          </Route>

          <Route exact path={mainPath}>
            <UserServices onSelectService={onSelectService}></UserServices>
          </Route>

          <Route exact path={`${singleServicePath}`}>
            {selectedService ? (
              <UserService service={selectedService}></UserService>
            ) : (
              <Redirect to={mainPath}></Redirect>
            )}
          </Route>

          <Route exact path={`${editServicePath}`}>
            {selectedService ? (
              <EditService service={selectedService}></EditService>
            ) : (
              <Redirect to={mainPath}></Redirect>
            )}
          </Route>

          <Route exact path={profilePath}>
            <Profile></Profile>
          </Route>
        </Switch>
      </div>
      <Footer />
    </div>
  )
}
