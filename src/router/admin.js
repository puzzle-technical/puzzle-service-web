import { useState, useEffect } from "react";
import {
  Route,
  Switch,
  useRouteMatch,
  Link,
  useHistory,
  useLocation,
  Redirect,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAdminToken } from "../store/selectors/sessionSelectors";
import { getAdminUser } from "../store/selectors/userSelectors";
import { verifyAdminUserAuth } from "../services/auth";

import Navbar from "../components/navbar";

import AdminUsersPanel from "../pages/adminPanel/users";
import AdminCategoriesPanel from "../pages/adminPanel/categories";
import LoginAdmin from "../pages/loginAdmin";

export default function UserRouter() {
  const location = useLocation();
  const { path } = useRouteMatch();
  const adminToken = useSelector(getAdminToken);
  const adminUser = useSelector(getAdminUser);
  const [isTokenValid, setIsTokenValid] = useState();

  const userHasData = () => {
    return adminUser && adminUser != {};
  };

  useEffect(() => {
    const verify = async () => {
      let verify = false;
      if (userHasData()) verify = await verifyAdminUserAuth(adminToken);
      console.log(verify);
      setIsTokenValid(verify);
    };
    verify();
  }, [adminToken]);

  const mainPath = `${path}/`;
  const loginPath = `${path}/login`;
  const categoriesPath = `${path}/categories`;

  const menuOptions = [
    <Link
      to={mainPath}
      className={`button-simple ${
        location.pathname == mainPath ? "active" : ""
      }`}
    >
      USUÁRIOS
    </Link>,
    <Link
      to={categoriesPath}
      className={`button-simple ${
        location.pathname == categoriesPath ? "active" : ""
      }`}
    >
      CATEGORIAS
    </Link>,
  ];

  return (
    <div>
      {location.pathname != loginPath && (
        <Navbar menuOptions={menuOptions}></Navbar>
      )}
      <Switch>
        <Route exact path={mainPath}>
          {!userHasData() || !isTokenValid ? (
            <Redirect to={`${path}/login`} />
          ) : (
            <AdminUsersPanel></AdminUsersPanel>
          )}
        </Route>

        <Route exact path={categoriesPath}>
          { !userHasData() || !isTokenValid ?
          <Redirect to={`${path}/login`}/> :
          <AdminCategoriesPanel></AdminCategoriesPanel>
          }
        </Route>

        <Route exact path={`${loginPath}`}>
          {isTokenValid && userHasData() ? (
            <Redirect to={path} />
          ) : (
            <LoginAdmin />
          )}
        </Route>
      </Switch>
    </div>
  );
}
