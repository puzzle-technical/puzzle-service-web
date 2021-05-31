import './index.css'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../../api'
import DefaultAvatar from '../../assets/img/defaultAvatar.png'
import { ReactComponent as CommentIcon } from '../../assets/icons/comment.svg';

import Dropdown from '../dropDown'
import Modal from '../modal'
import { ReactComponent as EllipsisIcon } from '../../assets/icons/ellipsis-vertical.svg';

const useMailto = true

export default function UserNegotiation (props) {
  const { service, active } = props
  const { idService, nome, descricao, dataPublic, location, subcategories } = service
  const budget = service.budgets.find(el => el.status == 'selecionado')
  const provider = budget?.provider
  const imgSrc = provider?.avatar || DefaultAvatar
  const history = useHistory()

  const element = <EllipsisIcon height={20}></EllipsisIcon>

  const dropdownOptions = [    
    <div onClick={() => {
      displayAlert('Tem certeza que deseja cancelar esta negociação?\nO serviço voltará a ficar aberto para novas propostas.', '', () => {
        cancelNegotiation()
      })
    }}>
      Cancelar negociação
    </div>
  ]

  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})

  const cancelNegotiation = async () => {
  }

  const displayAlert = (content, title = 'Atenção', onConfirmation) => {
    setModalInfo({ title, content, onConfirmation })
    setShowModal(true)
    return
  }

  const openedBox = (
    <div className="negotiation-box-opened">
      <div className="negotiation-box-provider">
        <div className="proposal-provider-header">
          <div className="proposal-provider-avatar" style={{ backgroundImage: `url(${imgSrc})` }}></div>
          <div>
            <p>{provider?.nome}</p>
            <p>{provider?.email}</p>
            <p>{provider?.celular}</p>
          </div>
        </div>
        <p>{ subcategories && subcategories.length ? `Trabalha com: ${subcategories.map(el => el.nome).join(', ')}` : '' }</p>
        <button className="proposal-provider-button button" onClick={() => {
          window.location.href = useMailto ? `mailto:${provider?.email}` : `https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${provider?.email}&subject = Proposta de orçamento [Puzzle Service]`
        }}>
          ENVIAR EMAIL PARA {provider?.nome.split(' ')[0].toUpperCase()}
        </button>
      </div>

      <div className="negotiation-box-budget">
        <div className="negotiation-box-header">
          <h4 className="negotiation-box-title">{nome}</h4>
          <span className="negotiation-box-date">{(new Date(dataPublic)).toLocaleString()}</span>
          <p className="negotiation-box-adress">{location ? `${location.bairro} - ${location.cidade}` : ''}</p>
        </div>
        <p>{descricao}</p>
        <br/>
        <div className="negotiation-box-proposal">
          <h4 className="proposal-title">
            <span>Proposta de orçamento</span>
            <CommentIcon width={18}></CommentIcon>
          </h4>
          <p className="proposal-date">{(new Date(budget?.dataPublic)).toLocaleString()}</p>
          <p className="proposal-descricao">{budget?.descricao}</p>
        </div>
      </div>

      <buton className="negotiation-box-button">
        <Dropdown element={element} dropdownOptions={dropdownOptions} textAlign="right"></Dropdown>
      </buton>
    </div>
  )

  const closedBox = (
    <div className="negotiation-box-header">
      <h4 className="negotiation-box-title">{nome}</h4>
      <span className="negotiation-box-date">{(new Date(dataPublic)).toLocaleString()}</span>
      <p className="negotiation-box-adress">{location ? `${location.bairro} - ${location.cidade}` : ''}</p>
    </div>
  )

  return <div>
  
    <div className="negotiation-box-content">
      { active ? openedBox : closedBox }
    </div>
    <Modal active={showModal} onClose={() => setShowModal(false)} onConfirmation={modalInfo.onConfirmation} title={modalInfo.title}>
      {modalInfo.content}
    </Modal>
  </div>
}