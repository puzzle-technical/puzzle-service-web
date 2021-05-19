import { Switch, Route, useRouteMatch } from "react-router-dom";

export default function MainRouter () {
  const { path } = useRouteMatch()

  // PATHS
  const mainPath = path
  const servicesPath = `${path}/services`

  return <div>
    {/* <Navbar menuOptions={menuOptions}/> */}
    
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