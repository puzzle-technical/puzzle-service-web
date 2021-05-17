import './index.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'
import api from '../../api'
import stripePromise from '../../services/stripe' 

import Loading from '../../components/loading'
import Modal from '../../components/modal'

export default function ProviderPoints (props) {
  const user = useSelector(getUser)
  const [packs, setPacks] = useState([])

  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})
  const [operationSuccess, setOperationSuccess] = useState()

  useEffect(() => {
    const load = async () => {
      await api.get('points/getPacks')
      .then(res => {
        console.log(res.data)
        setPacks(res.data.data)
        setLoading(false)
      })
    }
    load()
    .catch(err => {
      console.log(err)
      setLoading(false)
    })
  }, [])

  const selectPack = async (idPack) => {
    setLoading(true)
    const stripe = await stripePromise
    const response = await api.post('points/createCheckoutSession', { idPack, email: user.email })
    .then(async res => {
      console.log(res.data)
      if (res.data.success) {
        const result = await stripe.redirectToCheckout(res.data.data)
      }
    })
    .catch(err => {
      console.log(err)
      displayAlert('Ocorreu algum erro. Tente novamente mais tarde.', 'Erro')
    })
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

  return <div className="points-page">
    { loading ? <Loading></Loading> :
      packs.length > 0 ?
      packs.map(pack => {
        return <div key={pack.idPack} className="pack">
          <div className="pack-background">
            <img src={pack.backgroundImage}></img>
          </div>
          <h2 className="pack-title">PuzzlePoints</h2>
          <p className="pack-description">{pack.amount} PuzzlePoints</p>
          <div>
            <p className="pack-price">{Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(pack.price / 100)}</p>
            <p className="pack-discount">{pack.discount ? `${pack.discount}% de desconto` : ''}</p>
          </div>
          <button className="button" onClick={() => selectPack(pack.idPack)}>ADQUIRIR</button>
        </div>
      }) :
      <p>Houve algum erro. Por favor, contate o suporte.</p>
    }
    <Modal active={showModal} onClose={onModalClose} onConfirmation={modalInfo.onConfirmation} title={modalInfo.title}>
      {modalInfo.content}
    </Modal>
  </div>
}