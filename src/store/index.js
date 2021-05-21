import { compose, createStore } from 'redux'
import persistState from 'redux-localstorage'
import { Reducers } from './reducers'

const enhancer = compose(
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  persistState()
)

export const store = createStore(
  Reducers,
  enhancer
)