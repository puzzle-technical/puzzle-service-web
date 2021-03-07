import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './pages/home'
import Login from './pages/login'

import Button from './components/button';
import Navbar from './components/navbar';
import Footer from './components/footer';

function App() {

  var menuOptions = [
    <Link to="/services" className="button-simple">SERVIÇOS</Link>,
    <Link to="/login" className="button-simple">ENTRAR</Link>,
    <Button title="SEJA UM PROFISSIONAL"><Link to="/"></Link></Button>,
  ]

  return <Router>
      <Route exact path="/">
        <Navbar menuOptions={menuOptions}/>
        <Switch>
          <Route exact path="/">
            <Home/>
          </Route>
        </Switch>
        <Footer/>
      </Route>
      
      <Route path="/services">
        <div>
          <h1>Services</h1>
        </div>
      </Route>
      <Route path="/login">
        <Login/>
      </Route>
      <Route path="/auth">
        <div>
          <h1>Usuario logado</h1>
        </div>
      </Route>
      <Route path="/admin">
        <div>
          <h1>Usuario admin</h1>
        </div>
      </Route>
    </Router>
}

export default App;
