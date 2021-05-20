import { Switch, Route, Link, useLocation } from "react-router-dom";
import { mainBasePath, servicesPath, loginBasePath, singupBasePath } from './paths'

import Home from '../pages/home'
import Services from '../pages/services'

import Navbar from '../components/navbar'
import Footer from '../components/footer'

export default function MainRouter () {
  const { pathname } = useLocation();
  
  const menuOptions = [
    // <Link to={servicesPath}>
    //   <div className={`menu-tab ${pathname == servicesPath ? 'is-active' : ''}`}>Serviços</div>
    // </Link>,
    <Link to={loginBasePath}>Entrar</Link>,
    <Link to={singupBasePath}>
      <button className="button is-info">Seja um profissional</button>
    </Link>
  ]

  return <div className="navbar-page">
    <Navbar options={menuOptions}/>
    
    <div className="navbar-page-content">
      <Switch>
        
        <Route exact path={servicesPath}>
          <Services/>
        </Route>

        <Route path={mainBasePath}>
          <Home/>
        </Route>

      </Switch>
    </div>

    <Footer/>
  </div>
}