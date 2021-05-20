// import { useEffect } from 'react'
// import { Route, Switch, Redirect } from "react-router-dom";
// import { useSelector } from 'react-redux'
// import { getCurrentService } from '../store/selectors/userSelectors'
// // import api from '../api'

// export default function UserRouter () {
//   const currentService = useSelector(getCurrentService)

//   useEffect(() => {
//     // todo: load user info
//   }, [])

//   return <div>
//     {/* <Navbar menuOptions={menuOptions}/> */}

//     <div>
//       <Switch>

//         <Route exact path={mainPath}>
//           <div>User main</div>
//         </Route>

//         <Route exact path={createServicePath}>
//           <div>Create Service</div>
//         </Route>


//         <Route exact path={`${singleServicePath}`}>
//           {
//             currentService
//               ? <div>Current service</div>
//               : <Redirect to={mainPath}></Redirect>
//           }
//         </Route>

//         <Route exact path={`${editServicePath}`}>
//           {
//             currentService
//             ? <div>Edit service</div>
//             : <Redirect to={mainPath}></Redirect>
//           }
//         </Route>

//         <Route exact path={profilePath}>
//           <div>Profile</div>
//         </Route>

//       </Switch>
//     </div>

//     {/* <Footer/> */}
//   </div>
// }