import './index.css'
import { useState, useEffect } from 'react'
import Collapse from '../../components/collapse'
import api from '../../api'

export default function Services () {

  const [options, setOptions] = useState([])

  useEffect(() => {
    let load = async () => {
      await api.get('categories/getSubcategoriesGroups')
      .then(res => {
        let opt = []
        res.data.data.map(cat => {
          let closed = <h3 className="title">{cat.nome.toUpperCase()}</h3>
          let opened = <div>
            <h3 className="title">{cat.nome}</h3>
            <li className="list">
              {cat.subcategories.map((subcat, i) => {
                return <li key={i}>{subcat.nome}</li>
              })}
            </li>
          </div>
          opt.push({ opened, closed, background: cat.image })
        })
        setOptions(opt)
      })
      .catch(err => console.log(err))
    }
    load()
  }, [])

  return <div className="area">
    <h2>SERVIÇOS</h2>
    
    <Collapse options={options}></Collapse>
  </div>
}