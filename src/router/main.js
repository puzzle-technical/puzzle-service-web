import {
  Switch,
  Route,
  Link,
  useRouteMatch
} from "react-router-dom";

import Home from '../pages/home'
import Button from '../components/button';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function MainRouter () {
  const { path } = useRouteMatch()

  const menuOptions = [
    <Link to="/services" className="button-simple">SERVIÇOS</Link>,
    <Link to="/login" className="button-simple">ENTRAR</Link>,
    <Link to="/signup/1"><Button title="SEJA UM PROFISSIONAL"></Button></Link>,
  ]

  return <div className="main-page">
    <Navbar menuOptions={menuOptions}/>
    <div className="main-page-content">
      <Switch>
        
        <Route exact path={`/services`}>
          <div>
            <h1>Services</h1>
          </div>
        </Route>

        <Route path={path}>
          <Home/>
        </Route>

      </Switch>
    </div>
    <Footer/>
  </div>
}