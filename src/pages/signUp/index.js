import './index.css'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useState } from "react"
import InputMask from 'react-input-mask'
import axios from 'axios'

import api from '../../api'

import IconInput from '../../components/iconInput'
import Modal from '../../components/modal'
import Loading from '../../components/loading'
import Logo from '../../assets/img/logo.png'
import { ReactComponent as EyeIcon } from '../../assets/icons/eye.svg'
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg'

export default function UserSignUp () {
  const { type = 0 } = useParams()
  const history = useHistory()

  const [userType, setUserType] = useState(type)
  const [nome, setNome] = useState()
  const [email, setEmail] = useState()

  const [senha, setSenha] = useState()
  const [showSenha, setShowSenha] = useState()
  const [senhaConfirm, setSenhaConfirm] = useState()
  const [showSenhaConfirm, setShowSenhaConfirm] = useState()
  
  const [cpf, setCpf] = useState()
  const [data, setData] = useState()
  const [phone, setPhone] = useState()
  const [cep, setCep] = useState()
  const [uf, setUf] = useState()
  const [cidade, setCidade] = useState()
  const [logradouro, setLogradouro] = useState()
  const [numero, setNumero] = useState()
  const [complemento, setComplemento] = useState()
  const [bairro, setBairro] = useState()
  const [categorias, setCategorias] = useState()
  const [infoAdicional, setInfoAdicional] = useState()

  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})
  const [loading, setLoading] = useState()
  const [operationSuccess, setOperationSuccess] = useState()

  const displayAlert = (content, title = 'Atenção', onConfirmation) => {
    setModalInfo({ title, content, onConfirmation })
    setShowModal(true)
    return
  }

  const formIsValid = () => {
    // nome
    if (nome.match(/[^a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+/))
      return displayAlert(<p>
        O nome só pode conter letras e espaços.
      </p>, 'Nome inválido')

    // senha
    if (!senha.match(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{5,15})$/)) 
      return displayAlert(<p>
        As senhas precisam satisfazer as seguintes condições:
        <br/>
        <br/>- Deve ter entre 5 e 15 caracteres
        <br/>- Deve ter no mínimo um número e uma letra
        <br/>- Não pode conter caracteres especiais, acentos e nem espaços.
      </p>, 'Senha inválida')

    if (senha != senhaConfirm)
      return displayAlert(<p>
        As senhas estão diferentes. Por favor digite a mesma senha nos dois campos.
      </p>, 'Senha inválida')

    // cpf
    if (!cpf.match(/\d{3}.\d{3}.\d{3}-\d{2}/))
      return displayAlert(<p>
        Digite os 8 dígitos do cpf, mesmo que comece com 0.
      </p>, 'Cpf inválido')

    // telefone
    if (!phone.match(/\(\d{2}\)\s\d{4}-\d{4}/))
      return displayAlert(<p>
        Digite todos os dígitos do telefone, incluindo o ddd.
      </p>, 'Telefone inválido')

    // dataNasc
    if (Number(data.split('-')[0]) < 1910 && Number(data.split('-')[0]) < (new Date().getFullYear() - 18))
      return displayAlert(<p>
        Escolha um ano entre 1910 e {(new Date().getFullYear() - 18)}.
      </p>, 'Data de nascimento inválida')

    return true
  }

  const submit = e => {
    e.preventDefault()
    setLoading(true)
    if (!formIsValid()) return
    var formData = {
      nome: nome,
      email: email,
      tipoUser: userType + 1,
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
      senha: senha
    }

    console.log(formData)
    api.post(`/users/create`, formData)
    .then(res => {
      setLoading(false)
      console.log(res)
      if (res.data.success) {
        displayAlert(<p>{res.data.feedback}</p>, 'Sucesso')
        setOperationSuccess(true)
      } else {
        displayAlert(<p>{res.data.feedback}</p>, 'Erro')
      }
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
      displayAlert(<p>Algo inesperado aconteceu. Tente novamente mais tarde.</p>, 'Erro')
    })
  }

  const onModalClose = () => {
    if (operationSuccess) history.push('/login')
    setLoading(false)
    setShowModal(false)
  }

  const handleTypeChange = e => {
    setUserType(e.target.value)
  }

  const toggleShowSenha = () => {
    setShowSenha(!showSenha)
  }
  const toggleShowSenhaConfirm = () => {
    setShowSenhaConfirm(!showSenhaConfirm)
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
      setUf(res.data.uf)
    })
    .catch(err => console.log(err))
  }

  return <>
  <form className="signup-form" onSubmit={submit}>
    <section className="signup-header">
      <div>
        <h2>Tipo de conta</h2>
        <div className="signup-type">
          <label className={`signup-usertype ${userType == 0 ? 'selected' : ''}`}>
            <input type="radio" name="type" value={0} onChange={handleTypeChange}></input> Cliente
          </label>
          <label className={`signup-usertype ${userType == 1 ? 'selected' : ''}`}>
            <input type="radio" name="type" value={1} onChange={handleTypeChange}></input> Profissional
          </label>
        </div>
      </div>
      <Link to="/"><img className="sinup-logo" src={Logo} alt="logo" height={100}></img></Link>
    </section>

    <section className="signup-section">
      <h2>Preencha seus dados</h2>
      <div className="row">
        <div className="signup-field">
          <label>Nome completo</label>
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} required></input>
        </div>
        <div className="signup-field">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required></input>
        </div>
      </div>
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
      <div className="row">
        <div className="signup-field">
          <label>CPF</label>
          <InputMask value={cpf} required onChange={e => setCpf(e.target.value)}
          mask="999.999.999-99" maskChar="_"></InputMask>
        </div>
        <div className="signup-field">
          <label>Data de nascimento</label>
          <input type="date" value={data} required onChange={e => setData(e.target.value)}></input>
        </div>
        <div className="signup-field">
          <label>Telefone</label>
          <InputMask value={phone} required onChange={e => setPhone(e.target.value)}
          mask="(99) 99999-9999" maskChar="_"></InputMask>
        </div>
      </div>
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
        <div className="signup-field s25">
          <label>UF</label>
          <input type="text" value={uf} id="uf" onChange={e => setUf(e.target.value)} required></input>
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
          <input type="text" value={numero} id="numero" onChange={e => setNumero(e.target.value)} required></input>
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
        <div className="signup-field">
          <label>Área de atuação</label>
          <input type="text" value={categorias} onChange={e => setCategorias(e.target.value)} required></input>
        </div>
        {/* <div className="">
          <p>Você tem alguma outra especialização?</p>
          <Link to="#">Propronha um novo serviço.</Link>
        </div> */}
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
        <label>
          <input type="checkbox" required></input>
          Li e concordo com os <Link to="#">Termos de uso</Link> da Puzzle Service
        </label>
      </div>
      <div className="row center">
        {loading ? <Loading></Loading> :
        <button className="signup-button" type="submit">Finalizar cadastro</button>}
      </div>
    </section>
  </form>
  <Modal active={showModal} onClose={onModalClose} onConfirmation={modalInfo.onConfirmation} title={modalInfo.title}>
    {modalInfo.content}
  </Modal>
  </>
}