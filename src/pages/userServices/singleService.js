import './index.css'
import { useState } from 'react'
import { ReactComponent as BackIcon } from '../../assets/icons/arrow-left.svg';
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'
import api from '../../api'
import Modal from '../../components/modal'
import BudgetProposal from '../../components/budgetProposal'
import CreateBudget from '../../components/createBudget'
import defaultAvatar from '../../assets/img/defaultAvatar.png'

export default function UserServices(props) {
  const user = useSelector(getUser)
  const { service } = props
  const { idService, nome, descricao, status, dataPublic, location, subcategories, budgets, user: serviceUser } = service
  const history = useHistory()

  const [budgetProposals, setBudgetProposals] = useState(budgets)

  const removeProposal = id => {
    let newBudgets = [].concat(budgetProposals)
    newBudgets.splice(id, 1)
    setBudgetProposals(newBudgets)
  }
  
  const selectProposal = async (idBudget) => {
    console.log(idBudget)
    await api.put(`budgets/update/${idBudget}`, { budget: { status: 'selecionado' } })
    .then(async res => {
      let feedback = 'Orçamento selecionado com sucesso'
      if (!res.data.success) return displayAlert(res.data.feedback, 'Erro')
      await api.put(`services/update/${idService}`, { service: { status: 'fechado', idBudget } })
      .then(async res => {
        if (!res.data.success) return displayAlert(res.data.feedback, 'Erro')
      })
      displayAlert(feedback, 'Success')
      history.push('/user')
    })
    .catch(err => console.log(err))
  }
  
  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})

  const displayAlert = (content, title = 'Atenção', onConfirmation) => {
    setModalInfo({ title, content, onConfirmation })
    setShowModal(true)
    return
  }

  const userInfo = (() => {
    if (!serviceUser) return <p></p>
    let { nome, email, celular, avatar } = user
    let imgSrc = avatar || defaultAvatar
    return <div className="service-box-user-info">
      <div className="service-box-user-avatar" style={{ backgroundImage: `url(${imgSrc})`}}></div>
      <div>
        <p>{nome}</p>
        <p>{email}</p>
        <p>{celular}</p>
      </div>
    </div>
  })()

  return <div className="user-services-page">
    
    <div className="single-service-info">
      <div className="single-service-header">
        <h3 className="single-service-title">{nome}</h3>
        <span className="single-service-date">{(new Date(dataPublic)).toLocaleString()}</span>
      </div>
      <p>{descricao}</p>
      <br/>
      <div className="single-service-tags">
        <p><strong>Categorias:</strong> {subcategories && subcategories.map(el => el.nome).join(', ')}
        </p>
        <p><strong>Endereço:</strong> {`${location.logradouro}, nº ${location.numero}, ${location.bairro}, ${location.cidade} - ${location.uf}, CEP: ${location.cep}`}
        </p>
      </div>
      <br/><br/>
      
      { user.tipoUser == 'provider' ?

        <div>
          {userInfo}
          <br/><br/>
          <CreateBudget service={service} user={user}></CreateBudget>
        </div> :

        <div>
          <h3>Propostas recebidas</h3>
          {
            !budgetProposals.length > 0 ? <p>Nenhuma proposta foi feita ainda.</p> :
            budgetProposals.map((budget, id) => {
              return <BudgetProposal key={id} budget={budget} disabled={status == 'fechado'}
              onRemove={() => removeProposal(id)}
              onSelect={() => selectProposal(budget.idBudget)}></BudgetProposal>
            })
          }
        </div>
      }
    </div>
    <Modal active={showModal} onClose={() => setShowModal(false)} onConfirmation={modalInfo.onConfirmation} title={modalInfo.title}>
      {modalInfo.content}
    </Modal>
  </div>
}