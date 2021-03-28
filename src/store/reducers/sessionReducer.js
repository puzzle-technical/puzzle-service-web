import { SAVE_TOKEN } from '../actions/actionTypes'
import { defineState } from 'redux-localstore'

const defaultState = {
  token: null
}
const initialState = defineState(defaultState)('sessionState')

export default function providerReducer (state = initialState, action) {
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