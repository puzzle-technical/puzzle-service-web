import './index.css'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../../api'
import DefaultAvatar from '../../assets/img/defaultAvatar.png'
import Dropdown from '../dropDown'
import Modal from '../modal'
import { ReactComponent as CommentIcon } from '../../assets/icons/comment.svg';
import { ReactComponent as EllipsisIcon } from '../../assets/icons/ellipsis-vertical.svg';

export default function BudgetProposal(props) {
  const { budget, onRemove, onSelect, disabled } = props
  const { idBudget, dataPublic, descricao, provider, status } = budget
  const { avatar, nome, email, celular, subcategories } = provider || {}
  const imgSrc = avatar || DefaultAvatar
  const history = useHistory()

  const dropdownOptions = [
    <div onClick={() => {
      window.location.href = `https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${email}&subject = Proposta de orçamento [Puzzle Service]`
    }}>
      Enviar email para {provider.nome.split(' ')[0]}
    </div>,
    
    <div onClick={() => {
      displayAlert('Tem certeza que recusar esta proposta?\nIsso não poderá ser desfeito.', '', () => {
        cancelProposal()
      })
    }}>
      Recusar proposta
    </div>
  ]
  
  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})

  const cancelProposal = async () => {
    await api.put(`budgets/update/${idBudget}`, { budget: { status: 'recusado' } })
    .then(res => {
      if (!res.data.success) return displayAlert(res.data.feedback, 'Erro')
      onRemove()
    })
    .catch(err => console.log(err))
  }

  const displayAlert = (content, title = 'Atenção', onConfirmation) => {
    setModalInfo({ title, content, onConfirmation })
    setShowModal(true)
    return
  }

  const element = <EllipsisIcon height={20}></EllipsisIcon>

  return <div className="proposal">
    <div className="proposal-provider">
      <div className="proposal-provider-header">
        <div className="proposal-provider-avatar" style={{ backgroundImage: `url(${imgSrc})` }}></div>
        <div>
          <p>{nome}</p>
          <p>{email}</p>
          <p>{celular}</p>
        </div>
      </div>
      <p>{ subcategories && subcategories.length && `Trabalha com: ${subcategories.map(el => el.nome).join(', ')}` }</p>
    </div>
    <div className="proposal-content">
      <h4 className="proposal-title">
        <span>Proposta de orçamento</span>
        <CommentIcon width={18}></CommentIcon>
      </h4>
      <p className="proposal-date">{(new Date(dataPublic)).toLocaleString()}</p>
      <p className="proposal-descricao">{descricao}</p>
      {
        status != 'selecionado' ? 
        <button className="button" disabled={disabled} onClick={() => onSelect()}>SELECIONAR PROPOSTA</button> :
        <span className="button-simple">EM NEGOCIAÇÃO</span>
      }
    </div>
    
    <buton className="service-box-button">
      <Dropdown textAlign="right" element={element} dropdownOptions={dropdownOptions} ></Dropdown>
    </buton>
    <Modal active={showModal} onClose={() => setShowModal(false)} onConfirmation={modalInfo.onConfirmation} title={modalInfo.title}>
      {modalInfo.content}
    </Modal>
  </div>
}