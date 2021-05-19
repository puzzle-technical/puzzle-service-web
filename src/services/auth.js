import api from '../api'
import { wrapLogRequest } from '../utils'

export async function login (email, senha) {
  let result = undefined
  const setResult = res => { result = res }

  wrapLogRequest(api.post('/users/login', { email, senha }),
  (res) => setResult(res.data))

  return result
}

export async function verifyUserAuth (token) {
  return true
  // if (!token) return false

  // let result = false
  // const setResult = x => { result = x }

  // api.defaults.headers.common['x-access-token'] = token
  // await api.post('/users/validateToken', { token })
  // .then(res => {
  //   console.log(res)
  //   setResult(res.data)
  // })
  // .catch(err => { console.log(err) })
  // return result
}
