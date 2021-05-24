import { UPDATE_USER, UPDATE_ADMIN_USER } from '../actions/actionTypes'

const defaultState = {
  user: undefined,
  adminUser: undefined
}

export default function userReducer (state = defaultState, action) {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        user: action.user
      }
    case UPDATE_ADMIN_USER:
      return {
        ...state,
        adminUser: action.adminUser
      }
    default:
      return state
  }
}