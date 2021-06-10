import './index.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'
import api from '../../api'
import ServiceBox from '../../components/serviceBox/userServiceBox'
import UserNegotiation from '../../components/userNegotiation'
import Collapse from '../../components/collapse'

export default function UserServices(props) {
  const { onSelectService } = props
  const user = useSelector(getUser)
  const [draftServices, setDraftServices] = useState([])
  const [openedServices, setOpenedServices] = useState([])
  const [closedServices, setClosedServices] = useState([])
  
  const collapseOptions = closedServices.map(service => {
    return {
      opened: <UserNegotiation active service={service} onSelect={() => onSelectService(service)}></UserNegotiation>,
      closed: <UserNegotiation service={service} onSelect={() => onSelectService(service)}></UserNegotiation>
    }
  })

  useEffect(() => {
    const load = async () => {
      await api.get(`services/findByUser/${user.idUser}`)
      .then(async res => {
        // console.log(res.data)
        let newServices = res.data.data
        let promises = newServices.map(async (service, index) => {
          await api.get(`services/${service.idService}/getSubcategories`)
          .then(res => {
            // console.log(res.data)
            newServices[index].subcategories = res.data.data
          })
          await api.get(`services/${service.idService}/getLocation`)
          .then(res => {
            // console.log(res.data)
            newServices[index].location = res.data.data
          })
          await api.get(`budgets/findByService/${service.idService}`)
          .then(async res => {
            // console.log(res.data)
            let budgets = res.data.data
            for (let budget of budgets) {
              await api.get(`users/findById/${budget.idUser}`)
              .then(async res => {
                // console.log(res.data)
                let provider = res.data.data
                await api.get(`users/${budget.idUser}/getSubcategories`)
                .then(res => {
                  // console.log(res.data)
                  provider.subcategories = res.data.data
                })
                budget.provider = provider
              })
            }
            newServices[index].budgets = budgets
          })
        })
        await Promise.all(promises)
        console.log(newServices)
        setDraftServices(newServices.filter(el => el.status == 'rascunho'))
        setOpenedServices(newServices.filter(el => el.status == 'aberto'))
        setClosedServices(newServices.filter(el => el.status == 'fechado'))
      })      
    }
    load()
    .catch(err => console.log(err))
  }, [])

  return <div className="user-services-page">
    { draftServices.length > 0 && <div className="user-services">
        <h2>Rascunhos</h2>
        {
          draftServices.map(service => {
            return <ServiceBox key={service.idService} service={service} 
            onSelect={() => onSelectService(service)}></ServiceBox>
          })
        }
      </div>
    }<br/>

    {openedServices.length == 0 && <div className="user-services">
      <h2>Serviços publicados</h2>
      <p>Você não tem propostas de serviço publicadas.</p>
    </div>}
    { openedServices.length > 0 && <div className="user-services">
        <h2>Serviços publicados</h2>
        {
          openedServices.map(service => {
            return <ServiceBox key={service.idService} service={service} 
            onSelect={() => onSelectService(service)}></ServiceBox>
          })
        }
      </div>
    }<br/>

    { closedServices.length > 0 && <div className="user-services">
        <h2>Negociações</h2>
        {
          <Collapse options={collapseOptions}></Collapse>
        }
      </div>
    }<br/>
    
  </div>
}