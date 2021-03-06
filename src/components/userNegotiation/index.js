import './index.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'
import DefaultAvatar from '../../assets/img/defaultAvatar.png'
import { ReactComponent as CommentIcon } from '../../assets/icons/comment.svg'
import moment from 'moment'

import api from '../../api'
import Dropdown from '../dropDown'
import Modal from '../modal'
import Stars from '../stars'
import Evaluation from '../stars/evaluation'
import { ReactComponent as EllipsisIcon } from '../../assets/icons/ellipsis-vertical.svg'

const useMailto = false

export default function UserNegotiation(props) {
  const user = useSelector(getUser)
  const { service, active } = props
  const { nome, descricao, dataPublic, location, subcategories } = service
  const budget = service.budgets.find((el) => el.status == 'selecionado')
  const provider = budget?.provider
  const imgSrc = provider?.avatar || DefaultAvatar
  const idRatedUser = provider?.idUser
  const idEvaluatorUser = user.idUser

  const [alreadyRated, setAlreadyRated] = useState()

  useEffect(() => {
    const check = async () => {
      api
        .get(`/users/checkRatingExists/${idRatedUser}/${idEvaluatorUser}`)
        .then((res) => {
          console.log(res.data)
          if (res.data.success) setAlreadyRated(res.data.data)
        })
        .catch((err) => console.log(err))
    }
    check()
  }, [])

  const element = <EllipsisIcon height={20}></EllipsisIcon>

  const dropdownOptions = [
    <div onClick={() => evaluateUser()}>
      {alreadyRated ? 'Atualizar avaliação' : 'Avaliar usuário'}
    </div>,
    <div onClick={() => cancelNegotiation()}>Cancelar negociação</div>,
    <div onClick={() => finishNegotiation()}>Concluir negociação</div>,
  ]

  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})

  const cancelNegotiation = async () => {
    displayAlert(<div>
      <p>Tem certeza que deseja cancelar esta negociação?</p>
      <p>O serviço voltará a ficar aberto e a data de expiração será redefinida para mais 3 dias.</p>
    </div>, 'Cancelar negociação', async () => {
      api.put(`budgets/update/${budget?.idBudget}`, { budget: { status: 'cancelado' } })
      .then(res => {
        api.put(`services/update/${service.idService}`, { service: { status: 'aberto', dataExp: moment().add(3, 'days').toDate() } })
        .then(res => {
          displayAlert(res.data.feedback, res.data.success ? 'Sucesso': 'Erro', () => {
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
      <p>O serviço não voltará a ficar aberto.</p>
    </div>, 'Concluir negociação', async () => {
      api.put(`budgets/update/${budget?.idBudget}`, { budget: { status: 'concluido' } })
      .then(res => {
        api.put(`services/update/${service.idService}`, { service: { status: 'inativo' } })
        .then(res => {
          displayAlert(res.data.feedback, res.data.success ? 'Sucesso': 'Erro', () => {
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

  const evaluateUser = () => {
    let value = 0
    const setValue = (v) => (value = v)

    displayAlert(
      <div>
        <Evaluation
          idRatedUser={idRatedUser}
          idEvaluatorUser={idEvaluatorUser}
          onEvaluate={(value) => setValue(value)}
        />
      </div>,
      alreadyRated ? 'Atualizar avaliação' : 'Avaliar usuário',
      () => sendEvaluation(value)
    )
  }

  const sendEvaluation = async (value) => {
    console.log(value)
    if (!value || value <= 0) {
      return displayAlert('Por favor, escolha uma opção de 1 a 5.', '', () =>
        evaluateUser()
      )
    }
    let rating = {
      idRatedUser,
      idEvaluatorUser,
      value,
    }

    api
      .post(`/users/${alreadyRated ? 'updateRating' : 'addRating'}`, { rating })
      .then((res) => {
        displayAlert(res.data.feedback, res.data.success ? 'Sucesso' : 'Erro')
        window.location.reload()
      })
      .catch((err) => {
        console.log(err)
        displayAlert(
          'Ocorreu um erro. Por favor, tente novamente mais tarde ou contate o suporte.',
          'Erro'
        )
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
            <p>{provider?.email}</p>
            <p>{provider?.celular}</p>
            <Stars idRatedUser={provider?.idUser}></Stars>
          </div>
        </div>
        <p>
          {subcategories && subcategories.length
            ? `Trabalha com: ${subcategories.map((el) => el.nome).join(', ')}`
            : ''}
        </p>
        <button
          className='proposal-provider-button button'
          onClick={() => {
            window.open(useMailto
              ? `mailto:${provider?.email}`
              : `https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=${provider?.email}&subject=Proposta de orçamento [Puzzle Service]`,
              '_blank'
            )
          }}
        >
          ENVIAR EMAIL PARA {provider?.nome.split(' ')[0].toUpperCase()}
        </button>
      </div>

      <div className='negotiation-box-budget'>
        <div className='negotiation-box-header'>
          <h4 className='negotiation-box-title'>{nome}</h4>
          <span className='negotiation-box-date'>
            {moment(dataPublic).format('DD/MM/YYYY [às] hh:mm:ss')}
          </span>
          <p className='negotiation-box-adress'>
            {location ? `${location.bairro} - ${location.cidade}` : ''}
          </p>
        </div>
        <p>{descricao}</p>
        <br />
        <div className='negotiation-box-proposal'>
          <h4 className='proposal-title'>
            <span>Proposta de orçamento</span>
            <CommentIcon width={18}></CommentIcon>
          </h4>
          <p className='proposal-date'>
            {moment(budget?.dataPublic).format('DD/MM/YYYY [às] hh:mm:ss')}
          </p>
          <p className='proposal-descricao'>{budget?.descricao}</p>
        </div>
      </div>

      <button className='negotiation-box-button'>
        <Dropdown
          element={element}
          dropdownOptions={dropdownOptions}
          textAlign='right'
        ></Dropdown>
      </button>
    </div>
  )

  const closedBox = (
    <div className='negotiation-box-header'>
      <h4 className='negotiation-box-title'>{nome}</h4>
      <span className='negotiation-box-date'>
        {moment(dataPublic).format('DD/MM/YYYY [às] hh:mm:ss')}
      </span>
      <p className='negotiation-box-adress'>
        {location ? `${location.bairro} - ${location.cidade}` : ''}
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
