import './index.css'
import { useState } from 'react'
import api from '../../api'
import Logo from '../../assets/img/logo.png'
import Loading from '../../components/loading'
import Modal from '../../components/modal'
import { useHistory } from 'react-router-dom'

export default function Services () {
  const history = useHistory()
  const [email, setEmail] = useState()
  
  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})
  const [loading, setLoading] = useState()
  
  const displayAlert = (content, title = 'Atenção', onConfirmation) => {
    setModalInfo({ title, content, onConfirmation })
    setShowModal(true)
    return
  }
  const onModalClose = () => {
    setShowModal(false)
  }

  const onSubmit = async e => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    await api.post('/users/forgottenPassword', { email })
    .then(res => {
      console.log(res)
      if (res.data.success) displayAlert(res.data.feedback, 'Sucesso', () => { history.push('/login') })
      else displayAlert(res.data.feedback, 'Erro')
      setLoading(false)
    })
    .catch(err => {
      console.log(err);
      setLoading(false)
      displayAlert('Ocorreu algum erro. Tente novamente mais tarde.', 'Erro')
    })
  }

  return <div className="area forgotten-password-page">
    <div className="content">
      <h1 className="title">Esqueceu sua senha?</h1>

      <form onSubmit={onSubmit}>
        <p>Por favor, nos informe o seu email de cadastro. </p>
        <p>Nós lhe enviaremos uma nova senha para você acessar o nosso sistema.<br/>
        Você poderá mudá-la pelo seu perfil do usuário.</p>
        <input className="input" placeholder="Email" onInput={e => setEmail(e.target.value)}></input>
        <button className="button" type="submit">ENVIAR EMAIL</button>
      </form>
      <br/><br/>
      {loading && <Loading color="#fefefe"></Loading>}
      
      <Modal active={showModal} onClose={onModalClose} onConfirmation={modalInfo.onConfirmation} title={modalInfo.title}>
        {modalInfo.content}
      </Modal>
    </div>
    
    <div className="logo">
        <a href="/" ><img src={Logo} alt="logo" height={70}></img></a>
      </div>
  </div>
}