import { UPDATE_USER } from '../actions/actionTypes'

const defaultState = {
  user: undefined
}

export default function userReducer (state = defaultState, action) {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        user: action.user
      }
    default:
      return state
  }
}