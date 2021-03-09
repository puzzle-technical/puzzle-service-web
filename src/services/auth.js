import api from '../api'

export async function login (email, senha) {
  let result = 0
  const setResult = x => { result = x }

  await api.get('/users')
  .then(res => {
    // console.log(res)
    let users = res.data
    let emails = users.map(el => el.email)
    if (emails.indexOf(email) < 0) {
      setResult(-1)
    } else {
      setResult(1)
    }
  })
  .catch(err => {
    console.log(err)
    setResult(-2)
  })
  return result
}
