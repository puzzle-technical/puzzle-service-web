
import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'
import api from '../../api'

export default function UserMain() {
  const user = useSelector(getUser)
  const [loading, setLoading] = useState(false)

  const [draftServices, setDraftServices] = useState([])
  const [openedServices, setOpenedServices] = useState([])
  const [closedServices, setClosedServices] = useState([])

  const loadingRender= <div className="is-flex is-justify-content-center">
    <div className="loader is-primary"></div>
  </div>

  const draftsRender = draftServices
  ? draftServices.map((service, index) => {
      return <div className="box" key={index}>
        {service}
      </div>
    })
  : <p>Ouve um erro ao carregar os rascunhos. Por favor, tente novamente mais tarde ou contate o suporte.</p>

  
  const negotiationsRender = closedServices
  ? closedServices.map((service, index) => {
      return <div className="box" key={index}>
        {service}
      </div>
    })
  : <p>Ouve um erro ao carregar os serviços. Por favor, tente novamente mais tarde ou contate o suporte.</p>

  const servicesRender = openedServices
  ? openedServices.length
    ? openedServices.map((service, index) => {
        return <div className="box" key={index}>
          {service}
        </div>
      })
    : <div className="block">
        <p>Você ainda não criou nenhuma proposta de serviço.</p>
        <Link className="button mt-2" to="user/createService">Criar proposta de serviço</Link>
      </div>
  : <p>Ouve um erro ao carregar as negociações. Por favor, tente novamente mais tarde ou contate o suporte.</p>

  

  return loading ? loadingRender :
  <div className="">

    {/* drafts */}
    {(!draftServices || draftServices.length > 0) &&
      <div className="section pb-1">
        <h2 className="subtitle is-4 mb-2">Rascunhos</h2>
        { draftsRender }
      </div>
    }
    

    {/* services */}
    { <div className="section pb-1">
        <h2 className="subtitle is-4 mb-2">Meus serviços</h2>
        { servicesRender }
      </div>
    }

    
    {/* negotiations */}
    {(!closedServices || closedServices.length > 0) &&
      <div className="section pb-1">
        <h2 className="subtitle is-4 mb-2">Negociações</h2>
        { negotiationsRender }
      </div>
    }

  </div>
}