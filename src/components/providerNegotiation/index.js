import './index.css'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../../api'
import DefaultAvatar from '../../assets/img/defaultAvatar.png'
import { ReactComponent as CommentIcon } from '../../assets/icons/comment.svg'
import moment from 'moment'

import Dropdown from '../dropDown'
import Modal from '../modal'
import { ReactComponent as EllipsisIcon } from '../../assets/icons/ellipsis-vertical.svg'

const useMailto = false

export default function ProviderNegotiation(props) {
  const { budget, active } = props
  const { service, provider, descricao, dataPublic, location } = budget
  const imgSrc = provider?.avatar || DefaultAvatar
  const history = useHistory()

  const element = <EllipsisIcon height={20}></EllipsisIcon>

  const dropdownOptions = [
    <div onClick={() => cancelNegotiation()}>Cancelar negociação</div>,
    <div onClick={() => finishNegotiation()}>Concluir negociação</div>,
  ]

  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})

  const cancelNegotiation = async () => {
    displayAlert(<div>
      <p>Tem certeza que deseja cancelar esta negociação?</p>
      <p>O serviço continuará salvo.</p>
    </div>, 'Cancelar negociação', async () => {
      api.put(`budgets/update/${budget?.idBudget}`, { budget: { status: 'cancelado' } })
      .then(res => {
        api.put(`services/update/${service.idService}`, { service: { status: 'aberto', dataExp: moment().add(3, 'days').toDate() } })
        .then(res => {
          displayAlert('Negociação cancelada.', res.data.success ? 'Sucesso': 'Erro', () => {
            window.location.reload()
          })
        })
      })
      .catch(err => {
        console.log(err)
        displayAlert('Algo de errado aconteceu.', 'Erro')
      })
    })
  }

  const finishNegotiation = async () => {
    displayAlert(<div>
      <p>Tem certeza que deseja concluir esta negociação?</p>
    </div>, 'Concluir negociação', async () => {
      api.put(`budgets/update/${budget?.idBudget}`, { budget: { status: 'concluido' } })
      .then(res => {
        api.put(`services/update/${service.idService}`, { service: { status: 'inativo' } })
        .then(res => {
          displayAlert('Negociação concluida.', res.data.success ? 'Sucesso': 'Erro', () => {
            window.location.reload()
          })
        })
      })
      .catch(err => {
        console.log(err)
        displayAlert('Algo de errado aconteceu.', 'Erro')
      })
    })
  }

  const displayAlert = (content, title = 'Atenção', onConfirmation) => {
    setModalInfo({ title, content, onConfirmation })
    setShowModal(true)
    return
  }

  const openedBox = (
    <div className='negotiation-box-opened'>
      <div className='negotiation-box-provider'>
        <div className='proposal-provider-header'>
          <div
            className='proposal-provider-avatar'
            style={{ backgroundImage: `url(${imgSrc})` }}
          ></div>
          <div>
            <p>{provider?.nome}</p>
            <p style={{ fontSize: '.9rem' }}>{provider?.email}</p>
            <p style={{ fontSize: '.9rem' }}>{provider?.celular}</p>
          </div>
        </div>
        <br />
        <button
          className='proposal-provider-button button'
          onClick={() => {
            window.location.href = useMailto
              ? `mailto:${provider?.email}`
              : `https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${provider?.email}&subject=Proposta de orçamento [Puzzle Service]`
          }}
        >
          ENVIAR EMAIL PARA {provider?.nome.split(' ')[0].toUpperCase()}
        </button>
      </div>

      <div className='negotiation-box-budget'>
        <div className='negotiation-box-header'>
          <h4 className='negotiation-box-title'>{service?.nome}</h4>
          <span className='negotiation-box-date'>
            {moment(service?.dataPublic).format('DD/MM/YYYY [às] hh:mm:ss')}
          </span>
          <p className='negotiation-box-adress'>
            {service?.location
              ? `${service?.location.bairro} - ${service?.location.cidade}`
              : ''}
          </p>
        </div>
        <p>{service?.descricao}</p>
        <br />
        <div className='negotiation-box-proposal'>
          <h4 className='proposal-title'>
            <span>Proposta de orçamento</span>
            <CommentIcon width={18}></CommentIcon>
          </h4>
          <p className='proposal-date'>
            {moment(dataPublic).format('DD/MM/YYYY [às] hh:mm:ss')}
          </p>
          <p className='proposal-descricao'>{descricao}</p>
        </div>
      </div>

      {budget.status == 'selecionado' && (
        <button className='negotiation-box-button'>
          <Dropdown
            element={element}
            dropdownOptions={dropdownOptions}
            textAlign='right'
          ></Dropdown>
        </button>
      )}
    </div>
  )

  const closedBox = (
    <div className='negotiation-box-header'>
      <h4 className='negotiation-box-title'>{service?.nome}</h4>
      <span className='negotiation-box-date'>
        {moment(service?.dataPublic).format('DD/MM/YYYY [às] hh:mm:ss')}
      </span>
      <p className='negotiation-box-adress'>
        {service?.location
          ? `${service?.location.bairro} - ${service?.location.cidade}`
          : ''}
      </p>
    </div>
  )

  return (
    <div>
      <div className='negotiation-box-content'>
        {active ? openedBox : closedBox}
      </div>
      <Modal
        active={showModal}
        onClose={() => setShowModal(false)}
        onConfirmation={modalInfo.onConfirmation}
        title={modalInfo.title}
      >
        {modalInfo.content}
      </Modal>
    </div>
  )
}
