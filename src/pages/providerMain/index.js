import './index.css'
import ServiceBox from '../../components/serviceBox'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'
import api from '../../api'
import Modal from '../../components/modal'

export default function ProviderMain (props) {
  const user = useSelector(getUser)

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

  useEffect(() => {
    const loadServicesToMe = async () => {
      await api.get(`services/toUser/${user.idUser}`)
      .then(res => {
        setServicesToMe(res.data.data)
      })
      .catch(err => console.log(err))
    }

    const load = async () => {
      await api.get(`users/${user.idUser}/getSubcategories`)
      .then(async res => {
        setSubcategories(res.data.data)
        await api.get(`users/${user.idUser}/getLocations`)
        .then(res => {
          setLocations(res.data.data)
        })
      })
      .catch(err => console.log(err))
    }
    load()
    loadServicesToMe()
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
      api.post('services/findBySubcategories', { subcategoriesIds })
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
      api.post('services/findByLocations', { locations: locationsNames })
      .then(res => {
        console.log(res.data);
        setFilteredServices(res.data.data)
      })
      .catch(err => console.log(err))
    }

    if (filter == 0) loadBySubcategories()
    else loadByLocations()

  }, [filter, subcategories, locations])
  

  const selectService = () => {
    // console.log('aaaaaaa');
  }

  return <div className="provider-main-page">
    {/* <h2>Solicitações</h2>
    {servicesToMe && servicesToMe.length ?
    servicesToMe.map((el, id) => {
      return <ServiceBox key={id} service={el} onSelect={selectService}></ServiceBox>
    }) :
    <p>Nenhum serviço enviado diretamente para você.</p>
    } */}

    { servicesToMe && servicesToMe.length ?
      <div>
        <h2>Solicitações</h2>
        {
          servicesToMe.map((el, id) => {
      return <ServiceBox key={id} service={el} onSelect={selectService}></ServiceBox>
    })
        }
      </div> : 
      <></>
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
    {/* <div className="pesquisa-select">
      <div className="select">
        { filter == 0 ?
          // categorias
          <div> 
            <Select
              placeholder="Selecione uma ou mais categorias"
              value={selectedSubcategories}
              isMulti
              noOptionsMessage={() => 'Sem categorias disponíveis'}
              options={availableSubcategories}
              onChange={values => { setSelectedSubcategories(values) }}
              className="basic-multi-select"
              classNamePrefix="select">
            </Select>
          </div> :
          // localização
          <div> 
            <Select
              placeholder="Selecione uma ou mais locais"
              value={selectedLocations}
              isMulti
              noOptionsMessage={() => 'Sem locais disponíveis'}
              options={availableLocations}
              onChange={values => { selectedLocations(values) }}
              className="basic-multi-select"
              classNamePrefix="select">
            </Select>
          </div>
        }
      </div>
      <Button title="PESQUISAR"></Button>
    </div> */}


    {filteredServices && filteredServices.length ? 
      filteredServices.map((el, id) => {
        return <ServiceBox key={id} service={el} onSelect={() => displayAlert()}></ServiceBox>
      }) :
      <p>Nenhum serviço encontrado.</p>
    }

    <Modal active={showModal} onClose={() => setShowModal(false)} onConfirmation={modalInfo.onConfirmation} title={modalInfo.title}>
    {modalInfo.content}
    </Modal>
  </div>

}