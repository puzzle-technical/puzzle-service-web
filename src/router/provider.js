import { Route, Switch, useRouteMatch } from "react-router";

export default function UserRouter () {
  
  const { path } = useRouteMatch()

  return <Switch>

    <Route exact path={path}>
      <h1>provider home</h1>
    </Route>

    <Route exact path={`${path}/services`}>
      <h1>provider services</h1>
    </Route>

  </Switch>
}