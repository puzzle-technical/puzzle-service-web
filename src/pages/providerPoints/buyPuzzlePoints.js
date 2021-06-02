import { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import api from '../../api'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'
import stripePromise from '../../services/stripe'
import { Elements, useElements, useStripe, CardElement } from '@stripe/react-stripe-js'

import Loading from '../../components/loading'
import Modal from '../../components/modal'
import { ReactComponent as BackIcon } from '../../assets/icons/arrow-left.svg'
import Logo from '../../assets/img/logo.png'
import PuzzlePointImage from '../../assets/img/puzzlePointItem.jpg'

const PaymentForm = () => {
  const user = useSelector(getUser)
  const history = useHistory()
  const location =  useLocation()
  const stripe = useStripe()
  const elements = useElements()
  
  const { pack } = location.state
  const { idPack, quantity, price } = pack
  
  const [loading, setLoading] = useState()
  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})

  const displayAlert = (content, title = 'Atenção', onConfirmation) => {
    setModalInfo({ title, content, onConfirmation })
    setShowModal(true)
    return
  }

  useEffect(() => {
    if (idPack == undefined || idPack < 0 || idPack > 2) history.push('/user/points')
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    })

    if (error) {
      setLoading(false)
      return displayAlert(error.message, 'Erro')
    }

    const { id } = paymentMethod
    await api.post('/points/payment', {
      paymentId: id,
      amount: price,
      quantity,
      email: user.email,
      idUser: user.idUser
    })
    .then(res => {
      console.log(res.data)
      setLoading(false)
      if (res.data.success) return displayAlert(res.data.feedback, 'Sucesso', () => {
        history.push('/user/points')
      })
      else return displayAlert('Ocorreu algum erro. Tente novamente mais tarde ou contate o suporte.', 'Erro')
    })
    .catch(err => {
      console.log(err)
    })
  }

  const priceFormatted = Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(price / 100)

  return <div className="payment-page">
    <div className="payment-info">
      <div className="payment-info-header" onClick={() => history.goBack()}>
        <BackIcon color="#333" width={20}/>
        <img src={Logo} alt="logo" height={40}/>
      </div>
      <p>Puzzle Points [{quantity}]</p>
        <h3 className="pack-price">{priceFormatted}</h3>
        <img src={PuzzlePointImage} alt="puzzle points" className="item-image"></img>
    </div>
    <div className="payment-form">
      <form onSubmit={handleSubmit}>
        <h3>Pagamento</h3>
        <h2>Cartão de crédito</h2>
        <div className="payment-field">
          <label>Email</label>
          <input type="email" disabled defaultValue={user.email} className="payment-input"></input>
        </div>
        <div className="payment-field">
          <label>Informações do cartão</label>
          <div className="payment-input">
            <CardElement options={{ hidePostalCode: true }}></CardElement>
          </div>
        </div>
        <div className="payment-field">
          <label>Nome no cartão</label>
          <input className="payment-input" required></input>
        </div>
        <button type="submit" className="button" disabled={loading}>Pagar {priceFormatted}</button>
      </form>
      <div className="payment-loading">
        {loading && <Loading/>}
      </div>

      
      <Modal active={showModal} onClose={() => setShowModal(false)} onConfirmation={modalInfo.onConfirmation} title={modalInfo.title}>
        {modalInfo.content}
      </Modal>
    </div>
  </div>
}

export default function BuyPuzzlePoints () {
  return <div>
    <Elements options={{ locale: 'pt-BR' }} stripe={stripePromise}>
      <PaymentForm></PaymentForm>
    </Elements>
  </div>
}