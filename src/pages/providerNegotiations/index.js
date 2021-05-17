import './index.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'
import api from '../../api'
import ProviderNegotiation from '../../components/providerNegotiation'
import Collapse from '../../components/collapse'

export default function ProviderNegotiations() {
  const user = useSelector(getUser)
  const [openedBudgets, setOpenedBudgets] = useState([])
  const [closedBudgets, setClosedBudgets] = useState([])
  const [refusedBudgets, setRefusedBudgets] = useState([])
  
  const collapseOptionsOpened = openedBudgets.map(budget => {
    return {
      opened: <ProviderNegotiation active budget={budget}></ProviderNegotiation>,
      closed: <ProviderNegotiation budget={budget}></ProviderNegotiation>
    }
  })
  const collapseOptionsRefused = refusedBudgets.map(budget => {
    return {
      opened: <ProviderNegotiation active budget={budget}></ProviderNegotiation>,
      closed: <ProviderNegotiation budget={budget}></ProviderNegotiation>
    }
  })

  const collapseOptionsClosed = closedBudgets.map(budget => {
    return {
      opened: <ProviderNegotiation active budget={budget}></ProviderNegotiation>,
      closed: <ProviderNegotiation budget={budget}></ProviderNegotiation>
    }
  })

  useEffect(() => {
    const load = async () => {
      await api.get(`budgets/findByUser/${user.idUser}`)
      .then(async res => {
        // console.log(res.data)
        let budgets = res.data.data
        let promises = budgets.map(async budget => {
          return api.get(`services/findById/${budget.idService}`)
          .then(async res => {
            // console.log(res.data)
            if (res.data.success) {
              budget.service = res.data.data
              await api.get(`users/findById/${res.data.data.idUser}`)
              .then(res => {
                // console.log(res.data)
                if (res.data.success) budget.provider = res.data.data
              })
            }
          })
        })
        await Promise.all(promises)
        .then(() => {
          console.log(budgets);
          setClosedBudgets(budgets.filter(el => el.status == 'selecionado'))
          setOpenedBudgets(budgets.filter(el => el.status == 'aberto'))
          setRefusedBudgets(budgets.filter(el => el.status == 'recusado'))
        })
        
      })
    }
    load()
    .catch(err => console.log(err))
  }, [])

  return <div className="user-services-page">

    <h2>Orçamentos em análise</h2>
    { openedBudgets.length > 0 ?
      <div className="user-services">
        {
          <Collapse options={collapseOptionsOpened}></Collapse>
        }
      </div> :
      <div>Nenhum orçamento enviado.</div>
    }<br/>

    <h2>Orçamentos recusados</h2>
    { refusedBudgets.length > 0 ?
        <div className="user-services">
        {
          <Collapse options={collapseOptionsRefused}></Collapse>
        }
      </div> :
      <div>Nenhum orçamento recusado.</div>
    }<br/>

    <h2>Negociações</h2>
    { closedBudgets.length > 0 ?
        <div className="user-services">
        {
          <Collapse options={collapseOptionsClosed}></Collapse>
        }
      </div> :
      <div>Nenhuma negociação em andamento.</div>
    }<br/>

    
  </div>
}