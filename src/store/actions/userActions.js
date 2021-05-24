import * as types from './actionTypes'

export const updateUser = user => ({
  type: types.UPDATE_USER,
  user
})

export const updateAdminUser = adminUser => ({
  type: types.UPDATE_ADMIN_USER,
  adminUser
})