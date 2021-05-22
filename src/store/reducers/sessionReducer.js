import { SAVE_TOKEN } from '../actions/actionTypes'

const defaultState = {
  token: null
}

export default function providerReducer (state = defaultState, action) {
  switch (action.type) {
    case SAVE_TOKEN:
      return {
        ...state,
        token: action.token
      }
    default:
      return state
  }
}