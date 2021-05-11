import './index.css'
import { useState } from 'react'
import api from '../../api'
import Modal from '../../components/modal'
import { ReactComponent as TimesIcon } from '../../assets/icons/times.svg'
import { useHistory } from 'react-router-dom'


export default function CreateBudget(props) {
  let { service, user } = props
  const history = useHistory()
  
  const [text, setText] = useState('')
  const [operationSuccess, setOperationSuccess] = useState()
  const [showModal, setShowModal] = useState()
  const [showAlert, setShowAlert] = useState()
  const [alertInfo, setAlertInfo] = useState({})
  
  const displayAlert = (content, title = 'Atenção', onConfirmation) => {
    setAlertInfo({ title, content, onConfirmation })
    setShowAlert(true)
    return
  }

  const createBudget = async () => {
    let budget = {
      descricao: text,
      status: 'aberto',
      dataPublic: (new Date()),
      idService: service.idService,
      idUser: user?.idUser
    }
    api.post('budgets/create', { budget })
    .then(res => {
      displayAlert(res.data.feedback, res.data.success ? 'Sucesso' : 'Erro')
      setOperationSuccess(res.data.success)
    })
    .catch(err => console.log(err))
  }

  const onClose = () => {
    setShowModal(false)
    setText('')
  }
  
  const onConfirmation = e => {
    e.preventDefault()
    onClose()
    createBudget()
  }

  const createBudgetModal = showModal ? <div className="modal-wrapper">
    <form className="modal" onSubmit={onConfirmation}>
      <div className="modal-header">
        <h1 className="modal-title">Proposta de Orçamento</h1>
        <button className="modal-close" onClick={onClose}>
          <TimesIcon width={15}/>
        </button>
      </div>
      <div className="modal-content">
        <textarea value={text} onChange={e => setText(e.target.value)} required className="create-budget-textarea" placeholder="Escreva a sua proposta"></textarea>
      </div>
      <div className="modal-actions">
        <button className="modal-button" onClick={onClose}>Cancelar</button>
        <button className="modal-button active">Enviar proposta</button>
      </div>
    </form>
  </div>
  : <></>

  return <div>
    <button className="button" type="button" onClick={() => setShowModal(true)}>PROPOR ORÇAMENTO</button>

    <Modal active={showAlert} onClose={() => {
      setShowAlert(false)
      if (operationSuccess) history.push('/user/services')
    }} onConfirmation={alertInfo.onConfirmation} title={alertInfo.title}>
      {alertInfo.content}
    </Modal>
    
    {createBudgetModal}

  </div>
}