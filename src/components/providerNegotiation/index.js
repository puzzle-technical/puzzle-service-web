import './index.css'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../../api'
import DefaultAvatar from '../../assets/img/defaultAvatar.png'
import { ReactComponent as CommentIcon } from '../../assets/icons/comment.svg';

import Dropdown from '../dropDown'
import Modal from '../modal'
import { ReactComponent as EllipsisIcon } from '../../assets/icons/ellipsis-vertical.svg';

export default function ProviderNegotiation (props) {
  const { budget, active } = props
  const { service, provider, descricao, dataPublic, location } = budget
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
        </div><br/>
        <button className="proposal-provider-button button" onClick={() => {
          window.location.href = `https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${provider?.email}&subject=Proposta de orçamento [Puzzle Service]`
        }}>
          ENVIAR EMAIL PARA {provider?.nome.split(' ')[0].toUpperCase()}
        </button>
      </div>

      <div className="negotiation-box-budget">
        <div className="negotiation-box-header">
          <h4 className="negotiation-box-title">{service?.nome}</h4>
          <span className="negotiation-box-date">{(new Date(service?.dataPublic)).toLocaleString()}</span>
          <p className="negotiation-box-adress">{service?.location ? `${service?.location.bairro} - ${service?.location.cidade}` : ''}</p>
        </div>
        <p>{service?.descricao}</p>
        <br/>
        <div className="negotiation-box-proposal">
          <h4 className="proposal-title">
            <span>Proposta de orçamento</span>
            <CommentIcon width={18}></CommentIcon>
          </h4>
          <p className="proposal-date">{(new Date(dataPublic)).toLocaleString()}</p>
          <p className="proposal-descricao">{descricao}</p>
        </div>
      </div>

      { budget.status == 'selecionado' && <button className="negotiation-box-button">
        <Dropdown element={element} dropdownOptions={dropdownOptions} textAlign="right"></Dropdown>
      </button>}
    </div>
  )

  const closedBox = (
    <div className="negotiation-box-header">
      <h4 className="negotiation-box-title">{service?.nome}</h4>
      <span className="negotiation-box-date">{(new Date(dataPublic)).toLocaleString()}</span>
      <p className="negotiation-box-adress">{service?.location ? `${service?.location.bairro} - ${service?.location.cidade}` : ''}</p>
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