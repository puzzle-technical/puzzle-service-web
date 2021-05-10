import { useState, useEffect } from 'react'
import api from '../../api'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'
import InputMask from 'react-input-mask'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

import './index.css'

import ProviderBox from '../../components/providerBox'
// import Loading from '../../components/loading/'
import Select from 'react-select'
import Modal from '../../components/modal'
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg'
import { ReactComponent as BackIcon } from '../../assets/icons/arrow-left.svg';

export default function UserMain (props) {
  const { service } = props
  const user = useSelector(getUser)
  const history = useHistory()

  const [selectedProviders, setSelectedProviders] = useState([])
  const [subcategoriesDisabled, setSubcategoriesDisabled] = useState(true)
  const [availableSubcategories, setAvailableSubcategories] = useState([])
  const [selectedSubcategories, setSelectedSubcategories] = useState([])
  
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})

  const [nome, setNome] = useState(service?.nome)
  const [descricao, setDescricao] = useState(service?.descricao)
  const [status, setStatus] = useState(service?.status)
  const [receiversOnly, setReceiversOnly] = useState(service?.receiversOnly != 0)
  
  const [newStatus, setNewStatus] = useState(status)
    
  const [cep, setCep] = useState(service?.location.cep)
  const [cidade, setCidade] = useState(service?.location.cidade)
  const [logradouro, setLogradouro] = useState(service?.location.logradouro)
  const [numero, setNumero] = useState(service?.location.numero)
  const [complemento, setComplemento] = useState(service?.location.complemento)
  const [bairro, setBairro] = useState(service?.location.bairro)

  useEffect(() => {
    const load = async () => {
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
      if (service.receivers && service.receivers.length) {
        let providers = []
        let promises = service.receivers.split(';').map(async el => {
          await api.get(`users/findById/${el}`)
          .then(async res => {
            console.log(res.data)
            let provider = res.data.data
            if (provider) {
              await api.get(`users/${el}/getSubcategories`)
              .then(res => {
                console.log(res.data)
                provider.categories = res.data.data
              })
              providers.push(provider)
            }
          })
        })
        await Promise.all(promises)
        .catch(err => console.log(err))

        setSelectedProviders(providers)
        console.log(selectedProviders)
      }
    }

    load()
    .then(() => setLoading(false))
    .catch(err => {
      console.log(err)
      setLoading(false)
    })

    if (service.subcategories) {
      let newSelectedServices = service.subcategories.map(el => ({ id: el.idSubcategory,
        label: el.nome,
        value: el.idSubcategory }))
      setSelectedSubcategories(newSelectedServices)
    }
  }, [])

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
    
  const goBack = () => {
    history.push('/user')
  }

  const onModalClose = () => {
    setLoading(false)
    setShowModal(false)
  }

  const submit = (event) => {
    event.preventDefault()
    if (!subcategoriesDisabled && !selectedSubcategories.length)
      return displayAlert('Selecione alguma categoria para o serviço.', 'Atenção')

    let newdata = {
      nome,
      descricao,
      status: newStatus,
      receiversOnly: receiversOnly ? 1 : 0
    }
    let location = {
      uf: user.uf,
      logradouro: logradouro,
      numero: numero,
      complemento: complemento,
      bairro: bairro,
      cidade: cidade,
      cep: cep
    }
    api.put(`services/update/${service.idService}`, { service: newdata })
    .then(async res => {
      let feedback = res.data.feedback
      let title = res.data.success ? 'Sucesso' : 'Erro'
      if (res.data.success) setStatus(newStatus)

      await api.put(`services/${service.idService}/updateLocation`, { location })
      .then(res => {
        if (!res.data.success) {
          feedback = res.data.feedback
          title = res.data.success ? 'Sucesso' : 'Erro'
        }
      })

      if (!subcategoriesDisabled) {
        let subcategoriesIds = selectedSubcategories.map(el => el.id)
        api.put(`services/${service.idService}/updateSubcategories`, { subcategoriesIds })
        .then(res => { 
          if (!res.data.success) {
            feedback = res.data.feedback
            title = res.data.success ? 'Sucesso' : 'Erro'
          }
        })
      }
      displayAlert(feedback, title)
    })
    .catch(err => {
      console.log(err)
      displayAlert(<p>Algo inesperado aconteceu. Tente novamente mais tarde.</p>, 'Erro')
    })
  }

  return <div className="user-main-page">
    <form className="user-create-service" onSubmit={submit}>
      <div className="single-service-header">
        <div className="single-service-back-button" onClick={goBack}><BackIcon width={15}></BackIcon></div>
        <h2 className="title">Editar proposta de serviço</h2>
      </div>

      <h3 className="subtitle">Nome do serviço</h3>
      <input required className="input" value={nome} onChange={e => setNome(e.target.value)}
        placeholder="Nome do serviço">
      </input>

      <h3 className="subtitle">Descrição do serviço</h3>
      <textarea required className="textarea" value={descricao} onChange={e => setDescricao(e.target.value)}
        placeholder="Descreva o problema que precisa ser resolvido ou serviço que precisa ser feito.">
      </textarea>
      
      
      <section className="signup-section">
      <h3 className="subtitle">Localização do serviço</h3>
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

      <h3 className="subtitle">Categorias do serviço</h3>
      <div className="row"
          onClick={() => {
            if (!subcategoriesDisabled) return
            displayAlert('Tem certeza que deseja alterar as categorias do serviço?', '', () => {
              setSubcategoriesDisabled(false)
            })
          }}>
        <Select
          isDisabled={subcategoriesDisabled}
          placeholder=""
          value={selectedSubcategories}
          isMulti
          noOptionsMessage={() => 'Sem categorias disponíveis'}
          options={availableSubcategories}
          onChange={values => { setSelectedSubcategories(values) }}
          className="basic-multi-select"
          classNamePrefix="select">
        </Select>
      </div>

      
      <div className="">
          {selectedProviders && selectedProviders.length > 0 &&
            <div>
              <h3 className="subtitle">Profissionais selecionados</h3>
              <p>
                <label>
                  <input type="checkbox" checked={receiversOnly} onChange={e => setReceiversOnly(e.target.checked)}></input>
                  Apenas os profissionais selecionados podem visualizar o serviço.
                </label>
              </p>
              <div className="user-update-service-providers">
                {selectedProviders.map((el, id) => {
                  return <ProviderBox key={id} provider={el} 
                  categories={el.categories}></ProviderBox>
                })}
              </div>
            </div>
          }
      </div>

      <div className="edit-update">
        { status == 'rascunho' ? 
          <div className="edit-buttons">
            <button onClick={() => setNewStatus('aberto')} className="button" type="submit">PUBLICAR SERVIÇO</button><br/>
            <button className="button-simple" type="submit">SALVAR ALTERAÇÕES</button>
          </div> : 
          <button className="button" type="submit">SALVAR ALTERAÇÕES</button>
        }
      </div>
    </form>
    <Modal active={showModal} onClose={onModalClose} onConfirmation={modalInfo.onConfirmation} title={modalInfo.title}>
      {modalInfo.content}
    </Modal>
  </div>
}