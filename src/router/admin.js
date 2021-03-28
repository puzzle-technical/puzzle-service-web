import { Route, Switch, useRouteMatch } from "react-router";

export default function UserRouter () {
  
  const { path } = useRouteMatch()

  return <Switch>

    <Route exact path={path}>
      <h1>admin</h1>
    </Route>

  </Switch>
}