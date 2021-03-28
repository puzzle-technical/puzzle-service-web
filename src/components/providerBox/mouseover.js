import { useState } from 'react'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'

import './index.css'

import DefaultAvatar from '../../assets/img/defaultAvatar.png'
import { ReactComponent as Star } from '../../assets/icons/star.svg'
import { ReactComponent as TimesIcon } from '../../assets/icons/times.svg'

export default function ProviderBox (props) {
  const user = useSelector(getUser)
  const { provider, categories = [], onDeselect } = props
  const { nome, avaliacao, cidade, uf} = provider
  const [showMouseover, setShowMouseover] = useState(false)
  
  const imgSrc = user.avatar || DefaultAvatar

  const showPanel = () => {
    setShowMouseover(true)
  }
  const hidePanel = () => {
    setShowMouseover(false)
  } 

  const stars = value => {
    let newArr = []
    for (let i = 1; i <= 5; i++) {
      newArr[i-1] = <Star className="star" key={i} width={20} color={i <= value ? '#FFDE5B' : '#FFFFFF'} stroke="#3a3a3a" strokeWidth={20}></Star>      
    }
    return newArr
  }
    
  const mouseover = <div className="provider-box-mouseover">
    <div className="provider-box-info">
      <div className="provider-box-info-header">
        <div>
          <div className="provider-box-info-name">{nome}</div>
          <div>{cidade}/{uf}</div>
        </div>
        <div className="stars">
          {stars(avaliacao)}
        </div>
      </div>
      <p>
        { categories && categories.length ? 
          'Trabalha com:' + categories.map(el => el.name).join(', ') :
          'Sem categorias' }
      </p>
    </div>
  </div>

  return <div className="provider-circle" onMouseOver={showPanel} onMouseLeave={hidePanel} style={{ backgroundImage: `url(${imgSrc})` }}>
    <button className="provider-circle-button" onClick={onDeselect}>
      <TimesIcon width={12}/>
    </button>
    <div className="provider-circle-mouseover">
      {showMouseover && mouseover}
    </div>
  </div>
}