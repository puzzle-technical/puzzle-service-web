import './index.css'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'
import api from '../../api'
import ServiceBox from '../../components/serviceBox'

export default function ProviderServices (props) {
  const { onSelectService } = props
  const user = useSelector(getUser)
  const history = useHistory()

  const [services, setServices] = useState([])

  useEffect(() => {
    const load = async () => {
      await api.get(`users/${user.idUser}/getOpenedServices/`)
      .then(async res => {
        console.log(res.data)
        let services = res.data.data
        for (let service of services) {
          await api.get(`services/${service.idService}/getSubcategories`)
          .then(async res => {
            // console.log(res.data)
            if (res.data.success) service.subcategories = res.data.data
          })
          await api.get(`services/${service.idService}/getLocation`)
          .then(async res => {
            // console.log(res.data)
            if (res.data.success) service.location = res.data.data
          })
          await api.get(`users/findById/${service.idUser}`)
          .then(async res => {
            // console.log(res.data)
            if (res.data.success) service.user = res.data.data
          })
        }
        console.log(services)
        setServices(services)
      })
    }
    load()
    .catch(err => console.log(err))
  }, [])

  const openService = (service) => {
    onSelectService(service)
    history.push('/user/service')
  }

  return <div className="user-services-page">
    {services.length ? 
      services.map((el, id) => {
        return <ServiceBox key={id} service={el} onSelectService={() => openService(el)}></ServiceBox>
      }) :
      <p>Nenhum serviço encontrado.</p>
    }
  </div>
}