import { Switch, Route, useRouteMatch } from "react-router-dom";
import Navbar from '../components/navbar'

export default function MainRouter () {
  const { path } = useRouteMatch()

  // PATHS
  const mainPath = path
  const servicesPath = `${path}/services`

  return <div>
    <Navbar options={['Serviços', 'Entrar', 'Baby Shark']}/>
    
    <div>
      <Switch>
        
        <Route exact path={servicesPath}>
          <div>Services</div>
        </Route>

        <Route path={mainPath}>
          <div>Home</div>
        </Route>

      </Switch>
    </div>

    {/* <Footer/> */}
  </div>
}