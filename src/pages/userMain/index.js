import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'
import api from '../../api'

import './index.css'

import Button from '../../components/button'
import ProviderBox from '../../components/providerBox'
import ProviderBoxMouseover from '../../components/providerBox/mouseover'
// import Loading from '../../components/loading/'
import SelectCategories from '../../components/selectCategories'
import Modal from '../../components/modal'

export default function UserMain () {
  const user = useSelector(getUser)

  const [availableProviders, setAvailableProviders] = useState([])
  const [filteredAvailabledProviders, setFilteredAvailabledProviders] = useState([])
  const [selectedProviders, setSelectedProviders] = useState([])
  const [availableCategories, setAvailableCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})
  const [operationSuccess, setOperationSuccess] = useState()

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [localizacao, setLocalizacao] = useState('')


  useEffect(() => {
    const load = async () => {
      await api.get('users/provider')
      .then(res => {
        let providers = res.data.data
        if (!providers) return
        providers.forEach(async (el, index) => {
          await api.get(`users/${el.idUser}/getCategories`)
          .then(res => {
            let categories = res.data.data
            providers[index].categories = categories
            console.log(providers);        
          })
        })
        setAvailableProviders(providers)
      })
      await api.get('categories/')
      .then(res => {
        setAvailableCategories([...res.data.data])
      })
    }

    load()
    .then(() => setLoading(false))
    .catch(err => {
      console.log(err)
      setLoading(false)
    })
  }, [])

  const resetFields = () => {
    setSelectedCategories([])
    setSelectedProviders([])
    setFilteredAvailabledProviders([])
    setNome('')
    setDescricao('')
    setLocalizacao('')
  }

  const selectProvider = (provider) => {
    if (selectedProviders.indexOf(provider) >= 0) return
    let selected = [...selectedProviders]
    selected.push(provider)
    setSelectedProviders(selected)
  }

  const deselectProvider = (provider) => {
    let index = selectedProviders.indexOf(provider)
    if (index == -1) return
    
    let selected = [...selectedProviders]
    selected.splice(index, 1)
    setSelectedProviders(selected)
  }

  const searchByCategories = async () => {
    if (!selectedCategories || !selectedCategories.length) {
      setFilteredAvailabledProviders(availableProviders)
      return
    }
    let categoriesIds = selectedCategories.map(el => el.id)
    setLoading(true)
    await api.post('users/findProvidersByCategories', { categoriesIds })
    .then(res => {
      let newUsersIds = res.data.data.map(el => el.idUser)
      let newAvailableProviders = availableProviders.filter(el => newUsersIds.indexOf(el.idUser) >= 0)
      setFilteredAvailabledProviders(newAvailableProviders)
    })
    .catch(err => { console.log(err) })
    setLoading(false)
  }

  const displayAlert = (content, title = 'Atenção', onConfirmation) => {
    setModalInfo({ title, content, onConfirmation })
    setShowModal(true)
    return
  }
  
  const onModalClose = () => {
    setLoading(false)
    setShowModal(false)
    if (operationSuccess) return true
  }

  const submit = (event) => {
    event.preventDefault()
    let data = {
      idUser: user.idUser,
      nome,
      descricao,
      localizacao,
      dataPublic: new Date()
    }
    api.post('services/create', data)
    .then(res => {
      console.log(res)
      setLoading(false)
      let successFeedback

      if (!res.data.success) {
        setOperationSuccess(false)
        displayAlert(<p>{res.data.feedback}</p>, 'Erro', resetFields)
        return
      } else successFeedback = res.data.feedback

      let idService = res.data.data.insertId
      selectedCategories.forEach(cat => {
        api.post('services/addCategory', { idService, idCategory: cat.id })
        .then(res => {
          console.log(res)
          if (!res.data.success) {
            setOperationSuccess(false)
            displayAlert(<p>{res.data.feedback}</p>, 'Erro', resetFields)
            return
          } else {
            setOperationSuccess(true)
            displayAlert(<p>{successFeedback}</p>, 'Sucesso', resetFields)
          }
        })
      })
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      setOperationSuccess(false)
      displayAlert(<p>Algo inesperado aconteceu. Tente novamente mais tarde.</p>, 'Erro', resetFields)
    })
  }

  return <div className="user-main-page">
    <form className="user-create-service" onSubmit={submit}>
      <h2 className="title">Proposta de serviço</h2>

      <h3 className="subtitle">Nome do serviço</h3>
      <input required className="input" value={nome} onChange={e => setNome(e.target.value)}
        placeholder="Nome do serviço">
      </input>

      <h3 className="subtitle">Descrição do serviço</h3>
      <textarea required className="textarea" value={descricao} onChange={e => setDescricao(e.target.value)}
        placeholder="Descreva o problema que precisa ser resolvido ou serviço que precisa ser feito.">
      </textarea>
      
      <h3 className="subtitle">Informe a localização do serviço</h3>
      <textarea required className="textarea" value={localizacao} onChange={e => setLocalizacao(e.target.value)}
        placeholder="Escreva o endereço aonde o serviço deverá ser prestado.">
      </textarea>

      <h3 className="subtitle">Selecione as categorias deste serviço</h3>
      <SelectCategories
        categories={availableCategories.map(el => ({ id: el.idCategory, value: el.nome, label: el.nome }))}
        selectedCategories={selectedCategories}
        onSelectCategories={setSelectedCategories}
        onSearch={searchByCategories}
      />

      <div className="user-create-service-submition">
        <div>
          <h3 className="subtitle">Profissionais selecionados</h3>
          <div className="user-create-service-selected-providers">
            {selectedProviders && selectedProviders.length ?
              selectedProviders.map((el, id) => {
                return <ProviderBoxMouseover key={id}
                provider={el}
                onDeselect={() => deselectProvider(el)}
                />
              }) :
              <p>Nenhum profissional selecionado.</p>
            }
          </div>
        </div>
      </div>
        <div>
          <Button title="CRIAR PROPOSTA DE SERVIÇO" type="submit"/>
          <span className="send-to">Enviar para 
            { selectedProviders && selectedProviders.length ?
              ' ' + selectedProviders.map(el => el.nome.split(' ')[0]).splice(0, 3).join(', ')
                  + (selectedProviders.length > 3 ? '...' : '') :
              ' todos os profissionais disponíveis'
            }
          </span>
        </div>

      {!!filteredAvailabledProviders.length && <h3 className="subtitle">Profissionais disponíveis nas categorias selecionadas</h3>}
      <div className="user-create-service-available-providers">
        {filteredAvailabledProviders
        .map((el, id) => {
          if (selectedProviders.indexOf(el) < 0) {
            return <ProviderBox key={id} 
              provider={el}
              categories={el.categories && el.categories.length ? el.categories : []}
              onSelect={() => selectProvider(el)}>
            </ProviderBox>
          } else { return <></> }
        })}
      </div>
    </form>
    <Modal active={showModal} onClose={onModalClose} onConfirmation={modalInfo.onConfirmation} title={modalInfo.title}>
      {modalInfo.content}
    </Modal>
  </div>
}