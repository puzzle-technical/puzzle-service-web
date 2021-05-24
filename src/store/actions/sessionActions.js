import * as types from './actionTypes'

export const saveToken = token => ({
  type: types.SAVE_TOKEN,
  token
})

export const saveAdminToken = adminToken => ({
  type: types.SAVE_ADMIN_TOKEN,
  adminToken
})
