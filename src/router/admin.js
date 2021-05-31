import { useState, useEffect } from "react";
import {
  Route,
  Switch,
  useRouteMatch,
  Link,
  useLocation,
  Redirect,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateAdminUser } from '../store/actions/userActions'
import { getAdminToken } from "../store/selectors/sessionSelectors";
import { getAdminUser } from "../store/selectors/userSelectors";
import { verifyAdminUserAuth } from "../services/auth";

import Navbar from "../components/navbar";

import AdminUsersPanel from "../pages/adminPanel/users";
import AdminCategoriesPanel from "../pages/adminPanel/categories";
import LoginAdmin from "../pages/loginAdmin";

export default function UserRouter() {
  const location = useLocation();
  const dispatch = useDispatch()
  const { path } = useRouteMatch();
  const adminToken = useSelector(getAdminToken);
  const adminUser = useSelector(getAdminUser);
  const [isTokenValid, setIsTokenValid] = useState();
  const [loading, setLoading] = useState(true)

  const userHasData = () => {
    return adminUser && adminUser != {};
  };

  useEffect(() => {
    console.log(adminUser);
    const verify = async () => {
      let verify = false;
      if (userHasData()) verify = await verifyAdminUserAuth(adminToken);
      console.log(verify);
      setIsTokenValid(verify);
      setLoading(false)
    };
    verify();
  }, [adminToken]);

  const logout = () => {
    dispatch(updateAdminUser(undefined))
    window.location.reload()
  }

  const mainPath = `${path}/`;
  const loginPath = `${path}/login`;
  const categoriesPath = `${path}/categories`;

  const menuOptions = [
    <Link to={mainPath}
      className={`button-simple ${
        location.pathname == mainPath ? "active" : ""
      }`}>
      USUÁRIOS
    </Link>,
    <Link to={categoriesPath}
      className={`button-simple ${
        location.pathname == categoriesPath ? "active" : ""
      }`}>
      CATEGORIAS
    </Link>,
    <button className="button-simple" onClick={() => logout()}>SAIR</button>
  ];

  return ( loading ? '' : 
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
