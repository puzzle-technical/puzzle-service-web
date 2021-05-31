import './index.css'
import { useHistory } from 'react-router-dom'
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import InputMask from 'react-input-mask'
import axios from 'axios'

import api from '../../api'
import { getUFs, getMunicipios } from './../../services/location'
import { getUser } from '../../store/selectors/userSelectors'
import { updateUser } from '../../store/actions/userActions'

import DefaultAvatar from '../../assets/img/defaultAvatar.png'
import UploadImage from '../../components/uploadImage'
import Select from 'react-select'
import Modal from '../../components/modal'
import Loading from '../../components/loading'
import IconInput from '../../components/iconInput'
import { ReactComponent as EyeIcon } from '../../assets/icons/eye.svg'
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg'

export default function Profile () {
  const user = useSelector(getUser)
  const history = useHistory()
  const dispatch = useDispatch()

  const [userType] = useState(user.tipoUser == 'client' ? 0 : 1)
  const [nome, setNome] = useState(user.nome)
  const [email, setEmail] = useState(user.email)

  const [showPasswordFields, setShowPasswordFields] = useState(false)  
  const [senha, setSenha] = useState()
  const [showSenha, setShowSenha] = useState()
  const [senhaConfirm, setSenhaConfirm] = useState()
  const [showSenhaConfirm, setShowSenhaConfirm] = useState()
  
  const [cpf, setCpf] = useState(user.cpf)
  let birthdate = new Date(user.dataNasc).toISOString().split('T')[0]
  const [data, setData] = useState(birthdate)
  const [phone, setPhone] = useState(user.celular)
  const [cep, setCep] = useState(user.cep)

  const [avatar] = useState(user.avatar)
  const [avatarFile, setAvatarFile] = useState()
  
  const [availableUFs, setAvailableUFs] = useState([])
  const [selectedUF, setSelectedUF] = useState()
  const [uf, setUf] = useState()

  const [cidade, setCidade] = useState(user.cidade)
  const [logradouro, setLogradouro] = useState(user.logradouro)
  const [numero, setNumero] = useState(user.numero)
  const [complemento, setComplemento] = useState(user.complemento)
  const [bairro, setBairro] = useState(user.bairro)
  const [infoAdicional, setInfoAdicional] = useState(user.infoAdicional)

  const [availableSubcategories, setAvailableSubcategories] = useState([])
  const [selectedSubcategories, setSelectedSubcategories] = useState([])
  const [subcategoriesDisabled, setSubcategoriesDisabled] = useState(true)
  const [availableLocations, setAvailableLocations] = useState([])
  const [selectedLocations, setSelectedLocations] = useState([])
  const [locationsDisabled, setLocationsDisabled] = useState(true)

  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})
  const [loading, setLoading] = useState()
  const [operationSuccess, setOperationSuccess] = useState()

  useEffect(() => {
    console.log(avatarFile)
  }, [avatarFile])

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
        })
        console.log(categoriesGroups);
        setAvailableSubcategories(categoriesGroups)
      })
      let ufs = await getUFs()
      setAvailableUFs(ufs)
      if (user.uf) {
        let selUf = ufs.find(el => el.sigla == user.uf)
        setSelectedUF({ id: selUf.id, value: selUf.sigla, label: selUf.sigla })
      }
      if (userType == 1) {
        api.get(`users/${user.idUser}/getSubcategories`)
        .then(res => {
          let subcat = res.data.data.map(el => ({ id: el.idSubcategory, label: el.nome, value: el.idSubcategory }))
          setSelectedSubcategories(subcat)
        })
        api.get(`users/${user.idUser}/getLocations`)
        .then(res => {
          let locations = res.data.data.map(el => ({ id: el.idLocation, label: el.nome, value: el.nome }))
          setSelectedLocations(locations)
        })
      }
    }
    load()
    .catch(err => {
      console.log(err)
      setLoading(false)
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!selectedUF) return
    setUf(selectedUF.value)
    loadMunicipios(selectedUF.id)
  }, [selectedUF])
  
  const displayAlert = (content, title = 'Atenção', onConfirmation) => {
    setModalInfo({ title, content, onConfirmation })
    setShowModal(true)
    return
  }
  
  const toggleShowSenha = () => {
    setShowSenha(!showSenha)
  }
  const toggleShowSenhaConfirm = () => {
    setShowSenhaConfirm(!showSenhaConfirm)
  }

  const formIsValid = () => {
    // nome
    if (nome.match(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+/))
      return displayAlert(<p>
        O nome só pode conter letras e espaços.
      </p>, 'Nome inválido')


    if (showPasswordFields) {
      // senha
      if (!senha.match(/^(?=.*[0-9])(?=.*[a-zA-Z])([^\s]{5,15})$/)) 
        return displayAlert(<p>
          As senhas precisam satisfazer as seguintes condições:
          <br/>
          <br/>- Deve ter entre 5 e 15 caracteres
          <br/>- Deve ter no mínimo um número e uma letra
          <br/>- Não pode conter espaços.
        </p>, 'Senha inválida')

      if (senha != senhaConfirm) {
        return displayAlert(<p>
          As senhas estão diferentes. Por favor digite a mesma senha nos dois campos.
        </p>, 'Senha inválida')
      }
    }

    // cpf
    if (!cpf.match(/\d{3}.\d{3}.\d{3}-\d{2}/))
      return displayAlert(<p>
        Digite os 8 dígitos do cpf, mesmo que comece com 0.
      </p>, 'Cpf inválido')

    // telefone
    if (!phone.match(/\(\d{2}\)\s\d{5}-\d{4}/))
      

    // dataNasc
    if (Number(data.split('-')[0]) < 1910 && Number(data.split('-')[0]) < (new Date().getFullYear() - 18))
      return displayAlert(<p>
        Escolha um ano entre 1910 e {(new Date().getFullYear() - 18)}.
      </p>, 'Data de nascimento inválida')

    // provider
    if (userType == 1) {

      // subcategories
      if (!selectedSubcategories || !selectedSubcategories.length) {
        return displayAlert(<p>
          Selecione uma ou mais áreas de atuação.
        </p>, 'Áreas de atuação insuficientes')
      } 

      // locations
      if (!selectedLocations || !selectedLocations.length) {
        return displayAlert(<p>
          Selecione uma ou mais locais de atuação.
        </p>, 'Locais de atuação insuficientes')
      } 

    }

    return true
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

  const submit = e => {
    e.preventDefault()
    if (!formIsValid()) return
    setLoading(true)
    var formData = {
      nome: nome,
      email: email,
      cpf: cpf,
      celular: phone,
      dataNasc: data,
      logradouro: logradouro,
      numero: numero,
      complemento: complemento,
      bairro: bairro,
      cidade: cidade,
      uf: uf,
      cep: cep,
      infoAdicional: infoAdicional
    }
    if (showPasswordFields) formData.senha = senha

    console.log(formData)
    console.log('selectedSubcat', selectedSubcategories);
    console.log('selectedLocations', selectedLocations);
    console.log(avatarFile)

    api.put(`/users/update/${user.idUser}`, formData)
    .then(async res => {
      setLoading(false)
      let feedback

      console.log(res)
      if (res.data.success) {
        feedback = res.data.feedback
        console.log(avatarFile)
        if (avatarFile) {
          const fileMaxSize = 1000000

          if (avatarFile.size < fileMaxSize) {
            var formdata = new FormData()
            formdata.append('avatar', avatarFile)
            await api.post(`users/${user.idUser}/addAvatar`, formdata, { 
              headers: { "Content-Type": "multipart/form-data" }
            })
            .then(res => {
              console.log(res)
              if (!res.data.success) feedback = res.data.feedback
            })
          }          
        }

        if (userType == 1) {
          if (!subcategoriesDisabled) {
            let subcategoriesIds = selectedSubcategories.map(el => el.id)
            await api.put(`/users/${user.idUser}/updateSubcategories`, { idUser: user.idUser, subcategoriesIds })
            .then(res => {
              if (!res.data.success) feedback = res.data.feedback
            })
          }
          if (!locationsDisabled) {
            let locations = selectedLocations.map(el => el.value)
            await api.put(`/users/${user.idUser}/updateLocations`, { idUser: user.idUser, locations })
            .then(res => {
              if (!res.data.success) feedback = res.data.feedback
            })
          }
        }

        displayAlert(<p>{feedback}</p>, 'Sucesso')
        setOperationSuccess(true)
        reloadUserInfo()
      } else {
        return displayAlert(<p>{res.data.feedback}</p>, 'Erro')
      }
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      displayAlert(<p>Algo inesperado aconteceu. Tente novamente mais tarde.</p>, 'Erro')
    })
  }

  const onModalClose = () => {
    if (operationSuccess) history.go(0)
    setLoading(false)
    setShowModal(false)
  }

  const loadMunicipios = async id => {
    let municipios = await getMunicipios(id)
    setAvailableLocations(municipios.map(muni => {
      return {
        idLocation: muni.id,
        nome: muni.nome
      }
    }))
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
      
      let uf = availableUFs.find(el => el.sigla == res.data.uf)
      setSelectedUF({ id: uf.id, value: uf.sigla, label: uf.sigla })
    })
    .catch(err => console.log(err))
  }

  return <>
  <form className="signup-form" onSubmit={submit}>

    <h2>Dados pessoais</h2>
    <section className="signup-section">
      
      <div className="row personal">
        
        <div className="row">
          <div className="signup-field">
            <label>Imagem de perfil</label>
            <UploadImage imgSrc={avatar || DefaultAvatar} onInput={value => setAvatarFile(value)}
            onMaxSize={() => {
              displayAlert('Escolha uma imagem de até 3MB de tamanho.')
            }}></UploadImage>
          </div>
        </div>

        <div className="personal-data">

          <div className="row">
            <div className="signup-field">
              <label>Nome completo</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} required></input>
            </div>
            <div className="signup-field">
              <label>Email</label>
              <input type="email" disabled value={email} onChange={e => setEmail(e.target.value)} required></input>
            </div>
          </div>
          <div className="row">
            <div className="signup-field">
              <label>Data de nascimento</label>
              <input type="date" value={data} required onChange={e => setData(e.target.value)}></input>
            </div>
            <div className="signup-field">
              <label>CPF</label>
              <InputMask value={cpf} required onChange={e => setCpf(e.target.value)}
              mask="999.999.999-99" maskChar="_"></InputMask>
            </div>
            <div className="signup-field">
              <label>Telefone</label>
              <InputMask value={phone} required onChange={e => setPhone(e.target.value)}
              mask="(99) 99999-9999" maskChar="_"></InputMask>
            </div>
          </div>

        </div> 

      </div>
    </section>

    <section className="signup-section">
      <h2>Mudar senha</h2>
      { showPasswordFields ?
        <div className="row">
          <div className="signup-field">
            <label>Senha</label>
            <IconInput borderless required type={showSenha ? 'text' : 'password'}
              value={senha} onChange={e => setSenha(e.target.value)}
              right={
                <button className="button-simple" type="button" onClick={toggleShowSenha}>
                  <EyeIcon width={20} color={showSenha ? '#333' : '#aaa'}/>
                </button>
              }>
            </IconInput>
          </div>
          <div className="signup-field">
            <label>Confirmar senha</label>
            <IconInput borderless required type={showSenhaConfirm ? 'text' : 'password'}
              value={senhaConfirm} onChange={e => setSenhaConfirm(e.target.value)}
              right={
                <button className="button-simple" type="button" onClick={toggleShowSenhaConfirm}>
                  <EyeIcon width={20} color={showSenhaConfirm ? '#333' : '#aaa'}/>
                </button>
              }>
            </IconInput>
          </div>
        </div>
        : <button className="button" onClick={() => setShowPasswordFields(true)}>ATUALIZAR SENHA</button>
      }
    </section>
    
    <section className="signup-section">
      <h2>Endereço</h2>
      <div className="row">
        <div className="signup-field">
          <label>CEP</label>
          <InputMask value={cep} required onChange={e => setCep(e.target.value)}
          mask="99.999-999" maskChar="_"></InputMask>
          <button type="button" onClick={buscaCep} className="signup-search-button">
            <SearchIcon width={20} color="#777"/>
          </button>
        </div>
        <div className="signup-field s25 uf-select">
          <label>UF</label>
          <Select
            placeholder=""
            noOptionsMessage={() => 'Sem ufs disponíveis'}
            value={selectedUF}
            onChange={value => setSelectedUF(value)}
            options={availableUFs.map(el => ({ id: el.id, value: el.sigla, label: el.sigla }))}
            className="basic-multi-select"
            classNamePrefix="select">
          </Select>
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

    {userType == 1 && <section className="signup-section">
      <h2>Trabalho</h2>
      <div className="row">
        <div className="fluid">
          <h3 className="signup-label">Áreas de atuação</h3>
          <div onClick={() => {
            if (subcategoriesDisabled) {
              displayAlert('Tem certeza que deseja alterar as áreas de atuação?', 'Confirmação', () => {
                setSubcategoriesDisabled(false)
              })
            }
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
        </div>
        {/* <div className="">
          <p>Você tem alguma outra especialização?</p>
          <Link to="#">Propronha um novo serviço.</Link>
        </div> */}
      </div>      
      <div className="row">
        <div className="fluid">
          <h3 className="signup-label">Locais de atuação</h3>
          <div onClick={() => {
            if (locationsDisabled) {
              displayAlert('Tem certeza que deseja alterar os locais de atuação?', 'Confirmação', () => {
                setLocationsDisabled(false)
              })
            }
          }}>
            <Select
              isDisabled={locationsDisabled}
              value={selectedLocations}
              isMulti
              placeholder=""
              noOptionsMessage={() => 'Selecione uma UF'}
              options={availableLocations.map(el => ({ id: el.idLocation, value: el.nome, label: el.nome }))}
              onChange={values => { setSelectedLocations(values) }}
              className="basic-multi-select"
              classNamePrefix="select">
            </Select>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="signup-field">
          <label>Informações adicionais</label>
          <textarea rows="4" value={infoAdicional} onChange={e => setInfoAdicional(e.target.value)} type="text"></textarea>
        </div>
      </div>
    </section>}

    <section className="signup-section">
      <div className="row center">
        {loading ? <Loading></Loading> :
        <button className="signup-button" type="submit">Salvar alterações</button>}
      </div>
    </section>
  </form>
  <Modal active={showModal} onClose={onModalClose} onConfirmation={modalInfo.onConfirmation} title={modalInfo.title}>
    {modalInfo.content}
  </Modal>
  </>
}