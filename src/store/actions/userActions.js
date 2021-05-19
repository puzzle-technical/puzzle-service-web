import * as types from './actionTypes'

export const updateUser = user => ({
  type: types.UPDATE_USER,
  user
})

export const updateCurrentService = currentService => ({
  type: types.UPDATE_CURRENT_SERVICE,
  currentService
})