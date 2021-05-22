import { createStore, compose } from 'redux'
import { Reducers } from './reducers'
import persistState from 'redux-localstorage'

const enhancer = compose(
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  persistState()
)

export const store = createStore(
  Reducers,
  enhancer
)