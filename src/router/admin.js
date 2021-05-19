import { Route, Switch, useRouteMatch } from "react-router";

export default function UserRouter () {
  const { path } = useRouteMatch()

  // PATHS
  const mainPath = path


  return <Switch>

    <Route exact path={mainPath}>
      <h1>admin</h1>
    </Route>

  </Switch>
}