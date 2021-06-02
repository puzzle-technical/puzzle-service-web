import './index.css'
import ServiceBox from '../../components/serviceBox'
import { useHistory, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../../store/actions/userActions'
import { getUser } from '../../store/selectors/userSelectors'
import api from '../../api'
import Modal from '../../components/modal'

export default function ProviderMain (props) {
  const { onSelectService } = props
  const user = useSelector(getUser)
  const dispatch = useDispatch()
  const history = useHistory()

  const [servicePoints, setServicePoints] = useState()

  const [servicesToMe, setServicesToMe] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [locations, setLocations] = useState([])

  const [filter, setFilter] = useState(0)
  
  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})


  const displayAlert = (content, title = 'Atenção', onConfirmation) => {
    setModalInfo({ title, content, onConfirmation })
    setShowModal(true)
    return
  }

  const openService = (service) => {
    servicePoints > user.puzzlePoints ?
    displayAlert(<div>
      <p>Você não possui <strong>PuzzlePoints</strong> suficientes.</p><br/>
      <Link to="/user/points" className="button">Adquirir PuzzlePoints</Link>
    </div>, 'Pontos insuficientes') :
    displayAlert(<div>
      <p>Você irá gastar <strong>PuzzlePoints</strong> para esta ação.</p>
      <p>Tem certeza que deseja continuar?</p>
    </div>, 'Atenção', async () => {
      await api.post(`users/openService`, { idService: service.idService, idUser: user.idUser })
      .then(res => {
        displayAlert(res.data.feedback, res.data.success ? 'Sucesso' : 'Erro', !res.data.success ? '' : () => {
          reloadUserInfo()
          onSelectService(service)
          history.push('/user/service')
        })
      })
      .catch(err => {
        console.log(err)
        displayAlert('Ocorreu algo errado. Tente novamente mais tarde.', 'Erro')
      })
    })   
  }

  const reloadUserInfo = async () => {
    await api.get(`users/findById/${user.idUser}`)
    .then(res => {
      console.log(res)
      if (res.data.success) {
        dispatch(updateUser(res.data.data))
      }
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    const load = async () => {
      await api.get(`services/toUser/${user.idUser}`)
      .then(res => {
        setServicesToMe(res.data.data)
      })
      await api.get(`users/${user.idUser}/getSubcategories`)
      .then(async res => {
        setSubcategories(res.data.data)
        await api.get(`users/${user.idUser}/getLocations`)
        .then(res => {
          setLocations(res.data.data)
        })
      })
      await api.get(`points/getServicePoints`)
      .then(res => {
        setServicePoints(res.data.data)
      })
    }
    load()
    .catch(err => console.log(err))
    // eslint-disable-next-line 
  }, [])

  useEffect(() => {
    console.log(locations);
    console.log(subcategories);
    
    const loadBySubcategories = async () => {
      if (!subcategories || !subcategories.length) {
        setFilteredServices([])
        return
      }

      let subcategoriesIds = subcategories.map(el => el.idSubcategory)
      api.post('services/findBySubcategories', { subcategoriesIds, idUser: user.idUser })
      .then(res => {
        console.log(res.data);
        setFilteredServices(res.data.data)
      })
      .catch(err => console.log(err))
    }

    const loadByLocations = async () => {
      if (!locations || !locations.length) {
        setFilteredServices([])
        return
      }

      let locationsNames = locations.map(el => el.nome)
      api.post('services/findByLocations', { locations: locationsNames, idUser: user.idUser })
      .then(res => {
        console.log(res.data);
        setFilteredServices(res.data.data)
      })
      .catch(err => console.log(err))
    }

    if (filter == 0) loadBySubcategories()
    else loadByLocations()

  }, [filter, subcategories, locations])
  

  return <div className="provider-main-page">
    { servicesToMe &&
      <div>
        {servicesToMe.length ? <h2>Solicitações</h2> : ''}
        {
          servicesToMe.map((el, id) => {
            return <ServiceBox key={id} service={el} servicePoints={servicePoints} onSelectService={() => openService(el)}></ServiceBox>
          })
        }
      </div>
    }

    <br/>
    <h2>Recomendações</h2>
    <div className="provider-filter-type">
      <label className={`signup-usertype ${filter == 0 ? 'selected' : ''}`}>
        <input type="radio" name="type" value={0} onChange={e => setFilter(e.target.value)}></input>
        Procurar pelas minhas áreas de atuação
      </label>
      <label className={`signup-usertype ${filter == 1 ? 'selected' : ''}`}>
        <input type="radio" name="type" value={1} onChange={e => setFilter(e.target.value)}></input>
        Procurar pelos meus locais de atuação
      </label>
    </div>
    <br/>
    <h4>Procurando por: {
      filter == 0 ?
      subcategories.map(el => el.nome).join(', ') :
      locations.map(el => el.nome).join(', ')
      }
    </h4>
    <br/>


    {filteredServices.length ? 
      filteredServices.map((el, id) => {
        return <ServiceBox key={id} service={el} servicePoints={servicePoints} onSelectService={() => openService(el)}></ServiceBox>
      }) :
      <p>Nenhum serviço encontrado.</p>
    }

    <Modal active={showModal} onClose={() => setShowModal(false)} onConfirmation={modalInfo.onConfirmation} title={modalInfo.title}>
    {modalInfo.content}
    </Modal>
  </div>

}