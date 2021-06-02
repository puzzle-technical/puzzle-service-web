import './index.css'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../../api'

import Loading from '../../components/loading'

export default function ProviderPoints () {
  const history = useHistory()
  const [packs, setPacks] = useState([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      await api.get('points/getPacks')
      .then(res => {
        console.log('packs', res.data)
        setPacks(res.data.data)
        setLoading(false)
      })
    }
    load()
    .catch(err => {
      console.log(err)
      setLoading(false)
    })
  }, [])

  const selectPack = async (pack) => {
    setLoading(true)
    history.push({ pathname: '/buy-puzzle-points', state: { pack } })
  }

  return <div className="points-page">
    { loading ? <Loading></Loading> :
      packs.length > 0 ?
      packs.map(pack => {
        const { idPack, backgroundImage, quantity, price, discount } = pack
        return <div key={idPack} className="pack">
          <div className="pack-background">
            <img src={backgroundImage}></img>
          </div>
          <h2 className="pack-title">PuzzlePoints</h2>
          <p className="pack-description">{quantity} PuzzlePoints</p>
          <div>
            <p className="pack-price">{Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(price / 100)}</p>
            <p className="pack-discount">{discount ? `${discount}% de desconto` : ''}</p>
          </div>
          <button className="button" onClick={() => selectPack(pack)}>ADQUIRIR</button>
        </div>
      }) :
      <p>Houve algum erro. Por favor, contate o suporte.</p>
    }
  </div>
}