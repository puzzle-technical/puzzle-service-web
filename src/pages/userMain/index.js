import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'
import api from '../../api'

import './index.css'

import Button from '../../components/button'
import ProviderBox from '../../components/providerBox'
import ProviderBoxMouseover from '../../components/providerBox/mouseover'
import Loading from '../../components/loading/'
import SelectCategories from '../../components/selectCategories'

export default function UserMain () {
  const user = useSelector(getUser)

  const [loading, setLoading] = useState(true)
  const [availableProviders, setAvailableProviders] = useState([])
  const [filtereAvailabledProviders, setfiltereAvailabledProviders] = useState(availableProviders)
  const [selectedProviders, setSelectedProviders] = useState([])
  const [availableCategories, setAvailableCategories] = useState([])

  // console.log(user);

  useEffect(() => {
    const load = async () => {
      await api.get('users/provider')
      .then(res => {
        let providers = res.data.data
        providers.forEach(async (el, index) => {
          await api.get(`users/${el.idUser}/getCategories`)
          .then(res => {
            let categories = res.data.data
            providers[index].categories = categories
            console.log(providers);        
          })
        })
        setAvailableProviders(providers)
        setfiltereAvailabledProviders(providers)
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

  const searchByCategories = async (selectedCategories) => {
    if (!selectedCategories || !selectedCategories.length) {
      setfiltereAvailabledProviders(availableProviders)
      return
    }
    let categoriesIds = selectedCategories.map(el => el.id)
    setLoading(true)
    await api.post('users/findProvidersByCategories', { categoriesIds })
    .then(res => {
      let newUsersIds = res.data.data.map(el => el.idUser)
      let newAvailableProviders = availableProviders.filter(el => newUsersIds.indexOf(el.idUser) >= 0)
      setfiltereAvailabledProviders(newAvailableProviders)
    })
    .catch(err => { console.log(err) })
    setLoading(false)
  }

  return <div className="user-main-page">
    <div className="user-create-service">
      <h2 className="title">Proposta de serviço</h2>

      <h3 className="subtitle">Nome do serviço</h3>
      <input className="input"
        placeholder="Nome do serviço">
      </input>

      <h3 className="subtitle">Descrição do serviço</h3>
      <textarea className="textarea"
        placeholder="Descreva o problema que precisa ser resolvido ou serviço que precisa ser feito.">
      </textarea>
      
      <h3 className="subtitle">Informe a localização do serviço</h3>
      <textarea className="textarea"
        placeholder="Escreva o endereço aonde o serviço deverá ser prestado.">
      </textarea>

      <h3 className="subtitle">Selecione as categorias deste serviço</h3>
      <SelectCategories
        categories={availableCategories.map(el => ({ id: el.idCategory, value: el.nome, label: el.nome }))}
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
        <div>
          <span className="send-to">Enviar para 
            { selectedProviders && selectedProviders.length ?
              ' ' + selectedProviders.map(el => el.nome.split(' ')[0]).splice(0, 3).join(', ')
                  + (selectedProviders.length > 3 ? '...' : '') :
              ' todos os profissionais disponíveis'
            }
          </span>
          <Button title="CRIAR PROPOSTA DE SERVIÇO"/>
        </div>
      </div>

      <h3 className="subtitle">Profissionais disponíveis nas categorias selecionadas</h3>
      <div className="user-create-service-available-providers">
        {filtereAvailabledProviders
        .map((el, id) => {
          return selectedProviders.indexOf(el) < 0 ? 
          <ProviderBox key={id} 
            provider={el}
            categories={el.categories && el.categories.length ? el.categories : []}
            onSelect={() => selectProvider(el)}>
          </ProviderBox> : 
          <></>
        })}
      </div>
    </div>
  </div>
}