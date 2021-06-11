import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'

import './index.css'

import DefaultAvatar from '../../assets/img/defaultAvatar.png'
import Stars from '../stars'

export default function ProviderBox (props) {
  const { provider, categories = [], onSelect, alreadySelected, selectable } = props
  const { idUser, nome, cidade, uf} = provider
  
  const imgSrc = provider.avatar || DefaultAvatar
    
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
          <Stars idRatedUser={idUser}></Stars>
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