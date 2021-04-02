import axios from 'axios'

export async function getUFs () {
  let result = undefined
  const setResult = x => { result = x }

  await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
  .then(res => {
    console.log(res)
    setResult(res.data)
  })
  .catch(err => { console.log(err) })
  return result
}


export async function getMunicipios (idUF) {
  let result = undefined
  const setResult = x => { result = x }

  await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${idUF}/municipios`)
  .then(res => {
    console.log(res)
    setResult(res.data)
  })
  .catch(err => { console.log(err) })
  return result
}