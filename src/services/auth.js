import api from '../api'

export async function login (email, senha) {
  let result = undefined
  const setResult = x => { result = x }

  await api.post('/users/login', { email, senha })
  .then(res => {
    console.log(res)
    setResult(res.data)
  })
  .catch(err => { console.log(err) })
  return result
}

export async function loginAdmin (email, senha) {
  let result = undefined
  const setResult = x => { result = x }

  await api.post('/admin/login', { email, senha })
  .then(res => {
    console.log(res)
    setResult(res.data)
  })
  .catch(err => { console.log(err) })
  return result
}

export async function verifyUserAuth (token) {
  if (!token) return false

  let result = false
  const setResult = x => { result = x }

  api.defaults.headers.common['x-access-token'] = token
  await api.post('/users/validateToken', { token })
  .then(res => {
    console.log(res)
    setResult(res.data)
  })
  .catch(err => { console.log(err) })
  return result
}


export async function verifyAdminUserAuth (token) {
  if (!token) return false

  let result = false
  const setResult = x => { result = x }

  api.defaults.headers.common['x-access-token'] = token
  await api.post('/admin/validateToken', { token })
  .then(res => {
    console.log(res)
    setResult(res.data)
  })
  .catch(err => { console.log(err) })
  return result
}
