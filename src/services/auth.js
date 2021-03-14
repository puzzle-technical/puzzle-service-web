import api from '../api'

export async function login (email, senha) {
  let result = 0
  const setResult = x => { result = x }

  await api.post('/users/login', { email, senha })
  .then(res => {
    console.log(res)
    setResult(res.data)
  })
  .catch(err => { console.log(err) })
  return result
}
