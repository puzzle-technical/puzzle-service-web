import { UPDATE_USER } from '../actions/actionTypes'
import { defineState } from 'redux-localstore'

const defaultState = {
  user: undefined
}
const initialState = defineState(defaultState)('userState')

export default function userReducer (state = initialState, action) {
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