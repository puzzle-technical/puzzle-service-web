import { SAVE_TOKEN, SAVE_ADMIN_TOKEN } from '../actions/actionTypes'

const defaultState = {
  token: null,
  adminToken: null
}

export default function providerReducer (state = defaultState, action) {
  switch (action.type) {
    case SAVE_TOKEN:
      return {
        ...state,
        token: action.token
      }
    case SAVE_ADMIN_TOKEN:
      return {
        ...state,
        adminToken: action.adminToken
      }
    default:
      return state
  }
}