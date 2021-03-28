import { createStore } from 'redux'
import { Reducers } from './reducers'
import storeSynchronize from 'redux-localstore'

export const store = createStore(
  Reducers, 
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

storeSynchronize(store)