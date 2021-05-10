import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'
import api from '../../api'
import InputMask from 'react-input-mask'
import axios from 'axios'

import './index.css'

import Button from '../../components/button'
import ProviderBox from '../../components/providerBox'
import ProviderBoxMouseover from '../../components/providerBox/mouseover'
// import Loading from '../../components/loading/'
import Select from 'react-select'
import Modal from '../../components/modal'
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg'

export default function UserMain () {
  const user = useSelector(getUser)

  const [availableProviders, setAvailableProviders] = useState([])
  const [filteredAvailabledProviders, setFilteredAvailabledProviders] = useState([])
  const [selectedProviders, setSelectedProviders] = useState([])
  const [availableSubcategories, setAvailableSubcategories] = useState([])
  const [selectedSubcategories, setSelectedSubcategories] = useState([])
  
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})
  const [operationSuccess, setOperationSuccess] = useState()

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [status, setStatus] = useState('aberto')
  const [receiversOnly, setReceiversOnly] = useState(false)
    
  const [cep, setCep] = useState()
  const [cidade, setCidade] = useState()
  const [logradouro, setLogradouro] = useState()
  const [numero, setNumero] = useState()
  const [complemento, setComplemento] = useState()
  const [bairro, setBairro] = useState()

  useEffect(() => {
    for (let provider of selectedProviders) {
      let isValid = false
      provider.categories.forEach(cat => {
        if (selectedSubcategories.map(el => el.id).indexOf(cat.idSubcategory) >= 0) {
          isValid = true;
        }
      })
      if (!isValid) deselectProvider(provider)
    }
    // eslint-disable-next-line 
  }, [selectedSubcategories, selectedProviders])

  useEffect(() => {
    const load = async () => {
      await api.get('users/provider')
      .then(res => {
        let providers = res.data.data
        if (!providers) return
        providers.forEach(async (el, index) => {
          await api.get(`users/${el.idUser}/getSubcategories`)
          .then(res => {
            let categories = res.data.data
            providers[index].categories = categories
            // console.log(res.data.data);     
          })
        })
        setAvailableProviders(providers)
      })
      await api.get('categories/getSubcategoriesGroups')
      .then(res => {
        console.log(res.data);
        let categoriesGroups = []
        res.data.data.forEach(cat => {
          let group = {
            label: cat.nome,
            options: cat.subcategories.map(subcat => ({
              id: subcat.idSubcategory,
              label: subcat.nome,
              value: subcat.idSubcategory
            }))
          }
          categoriesGroups.push(group)
        });
        console.log(categoriesGroups);
        setAvailableSubcategories(categoriesGroups)
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
    setSelectedSubcategories([])
    setSelectedProviders([])
    setFilteredAvailabledProviders([])
    setNome('')
    setDescricao('')
    setCidade('')
    setBairro('')
    setLogradouro('')
    setNumero('')
    setComplemento('')
    setCep('')
    setStatus('aberto')
    setReceiversOnly(false)
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
    if (!selectedSubcategories || !selectedSubcategories.length) {
      setFilteredAvailabledProviders([])
      return
    }
    let subcategoriesIds = selectedSubcategories.map(el => el.id)
    setLoading(true)
    await api.post('users/findProvidersBySubcategories', { subcategoriesIds })
    .then(res => {
      console.log(res.data);
      let newUsersIds = res.data.data.map(el => el.idUser)
      let newAvailableProviders = availableProviders.filter(el => newUsersIds.indexOf(el.idUser) >= 0)
      setFilteredAvailabledProviders(newAvailableProviders)
    })
    .catch(err => { console.log(err) })
    setLoading(false)
  }

  const buscaCep = async () => {
    if (!cep || cep.length < 8) return
    axios.get(`https://viacep.com.br/ws/${cep.replace(/\D/, '')}/json/`)
    .then(res => {
      console.log(res)
      setBairro(res.data.bairro)
      setCep(res.data.cep)
      setComplemento(res.data.complemento)
      setCidade(res.data.localidade)
      setLogradouro(res.data.logradouro)
    })
    .catch(err => console.log(err))
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

  const formatReceivers = () => {
    if (!selectedProviders || !selectedProviders.length) return ''
    let string = selectedProviders.map(el => el.idUser).join(';')
    return string
  }

  const submit = (event) => {
    event.preventDefault()
    if (!selectedSubcategories.length) return displayAlert('Selecione alguma categoria para o serviço.', 'Atenção')
    let data = {
      idUser: user.idUser,
      nome,
      descricao,
      dataPublic: new Date(),
      receivers: formatReceivers(),
      receiversOnly: receiversOnly ? 1 : 0,
      status
    }
    api.post('services/create', data)
    .then(res => {
      console.log(res)
      setLoading(false)
      let successFeedback = res.data.feedback

      if (!res.data.success) {
        setOperationSuccess(false)
        displayAlert(<p>{res.data.feedback}</p>, 'Erro', resetFields)
        return
      } else successFeedback = res.data.feedback

      let idService = res.data.data.insertId
      selectedSubcategories.forEach(cat => {
        api.post('services/addSubcategory', { idService, idSubcategory: cat.id })
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
        let location = {
          uf: user.uf,
          logradouro: logradouro,
          numero: numero,
          complemento: complemento,
          bairro: bairro,
          cidade: cidade,
          cep: cep
        }
        api.post('services/addLocation', { idService, location })
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
      
      
      <section className="signup-section">
      <h3 className="subtitle">Informe a localização do serviço</h3>
      <div className="row">
        <div className="signup-field">
          <label>CEP</label>
          <InputMask value={cep} required onChange={e => setCep(e.target.value)}
          mask="99.999-999" maskChar="_"></InputMask>
          <button type="button" onClick={buscaCep} className="signup-search-button">
            <SearchIcon width={20} color="#777"/>
          </button>
        </div>
        <div className="signup-field">
          <label>Cidade</label>
          <input type="text" value={cidade} id="cidade" onChange={e => setCidade(e.target.value)} required></input>
        </div>
      </div>
      <div className="row">
        <div className="signup-field">
          <label>Logradouro</label>
          <input type="text" value={logradouro} id="logradouro" onChange={e => setLogradouro(e.target.value)} required></input>
        </div>
      </div>
      <div className="row">
        <div className="signup-field s25">
          <label>Nº</label>
          <input type="number" value={numero} id="numero" onChange={e => setNumero(e.target.value)} required></input>
        </div>
        <div className="signup-field">
          <label>Complemento</label>
          <input type="text" value={complemento} id="complemento" onChange={e => setComplemento(e.target.value)}></input>
        </div>
        <div className="signup-field">
          <label>Bairro</label>
          <input type="text" value={bairro} if="bairro" onChange={e => setBairro(e.target.value)} required></input>
        </div>
      </div>
    </section>

      <h3 className="subtitle">Selecione as categorias deste serviço</h3>
      <div className="row">
        <Select
          placeholder=""
          value={selectedSubcategories}
          isMulti
          noOptionsMessage={() => 'Sem categorias disponíveis'}
          options={availableSubcategories}
          onChange={values => { setSelectedSubcategories(values) }}
          className="basic-multi-select"
          classNamePrefix="select">
        </Select>
        <div className="search-providers-button">
          <Button title="BUSCAR PROFISSIONAIS" onClick={() => searchByCategories()}></Button>
        </div>
      </div>

      <h3 className="subtitle">Profissionais selecionados</h3>
      <p>
        <label>
          <input type="checkbox" value={receiversOnly} onInput={e => setReceiversOnly(e.target.value)}></input>
          Apenas os profissionais selecionados podem visualizar o serviço.
        </label>
      </p>
      <div className="user-create-service-submition">
        <div>
          <div className="user-create-service-selected-providers">
            {selectedProviders && selectedProviders.length ?
              selectedProviders.map((el, id) => {
                return <ProviderBoxMouseover key={id}
                provider={el}
                categories={el.categories}
                onDeselect={() => deselectProvider(el)}
                />
              }) :
              <p>Nenhum profissional selecionado.</p>
            }
          </div>
          <div>
            { console.log(selectedProviders) }
            <p className="send-to">Enviar para 
              { selectedProviders && selectedProviders.length ?
                ' ' + selectedProviders.map(el => el.nome.split(' ')[0]).splice(0, 5).join(', ')
                    + (selectedProviders.length > 5 ? '...' : '') :
                ' todos os profissionais disponíveis'
              }
            </p>
          </div>
        </div>
        <div className="user-create-service-buttons">
          <Button title="CRIAR PROPOSTA DE SERVIÇO" type="submit"/>
          <button className="button-simple" onClick={() => setStatus('rascunho')} type="submit">SALVAR COMO RASCUNHO</button>
        </div>
      </div>
      

      {filteredAvailabledProviders.length != selectedProviders.length && <h3 className="subtitle">Profissionais disponíveis nas categorias selecionadas</h3>}
      <div className="user-create-service-available-providers">
        {filteredAvailabledProviders
        .filter(el => selectedProviders.indexOf(el) < 0)
        .map((el, id) => {
          return <ProviderBox key={id} 
            selectable
            provider={el}
            categories={el.categories}
            onSelect={() => selectProvider(el)}>
          </ProviderBox>
        })}
      </div>
    </form>
    <Modal active={showModal} onClose={onModalClose} onConfirmation={modalInfo.onConfirmation} title={modalInfo.title}>
      {modalInfo.content}
    </Modal>
  </div>
}