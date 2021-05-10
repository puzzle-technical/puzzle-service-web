import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'

import './index.css'

import DefaultAvatar from '../../assets/img/defaultAvatar.png'
import { ReactComponent as Star } from '../../assets/icons/star.svg'

export default function ProviderBox (props) {
  const user = useSelector(getUser)
  const { provider, categories = [], onSelect, alreadySelected, selectable } = props
  const { nome, avaliacao, cidade, uf} = provider
  
  const imgSrc = provider.avatar || DefaultAvatar

  var stars = value => {
    let newArr = []
    for (let i = 1; i <= 5; i++) {
      newArr[i-1] = <Star className="star" key={i} width={20} color={i <= value ? '#FFDE5B' : '#FFFFFF'} stroke="#3a3a3a" strokeWidth={20}></Star>      
    }
    return newArr
  }
    
  return <div className="provider-box">
    <div className="provider-box-profile">
      <div className="provider-box-profile-image" style={{ backgroundImage: `url(${imgSrc})` }}></div>
      { selectable && <button type="button" className="provider-box-profile-button" onClick={onSelect} disabled={alreadySelected}>{alreadySelected ? 'SELECIONADO' : 'SELECIONAR'}</button>}
    </div>
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
          <><span>Trabalha com:</span>
          <strong>{' ' + categories.map(el => el.nome).join(', ')}</strong></> :
          'Sem categorias' }
      </p>
    </div>
  </div>
}