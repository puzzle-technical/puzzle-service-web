import './index.css'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from '../../api'

import Dropdown from '../dropDown'
import Modal from '../modal'
import { ReactComponent as EllipsisIcon } from '../../assets/icons/ellipsis-vertical.svg';

export default function ServiceBox (props) {
  const { service, onSelect } = props
  const history = useHistory()
  const { idService, nome, descricao, dataPublic, location, subcategories  } = service

  const element = <EllipsisIcon height={20}></EllipsisIcon>

  const dropdownOptions = [
    <div onClick={() => {
      onSelect()
      history.push('/user/editService')
    }}>
      Editar
    </div>,
    
    <div onClick={() => {
      displayAlert('Tem certeza que deseja excluir este serviço?\nIsso não poderá ser desfeito.', '', () => {
        removeService()
      })
    }}>
      Excluir
    </div>
  ]

  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})

  const removeService = async () => {
    await api.delete(`services/delete/${idService}`)
    .then(res => {
      console.log(res.data)
      displayAlert(res.data.feedback, res.data.succces ? 'Sucesso' : 'Erro')
      if (res.data.success) history.go(0)
    })
    .catch(err => {
      console.log(err)
      displayAlert(<p>Algo inesperado aconteceu. Tente novamente mais tarde.</p>, 'Erro')
    })
  }

  const displayAlert = (content, title = 'Atenção', onConfirmation) => {
    setModalInfo({ title, content, onConfirmation })
    setShowModal(true)
    return
  }

  return <div className="service-box">
    <div className="service-box-info" onClick={onSelect}>
      <div className="service-box-header">
        <h4 className="service-box-title">{nome}</h4>
        <span className="service-box-date">{(new Date(dataPublic)).toLocaleString()}</span>
        <p className="service-box-adress">{location ? `${location.bairro} - ${location.cidade}` : ''}</p>
      </div>
      <p>{descricao}</p>
      <div className="service-box-tags">
        { subcategories && 
          subcategories.map((el, id) => {
            return <span className="service-box-category" key={id}>{el.nome}</span>
          })          
        }
      </div>
    </div>
    <buton className="service-box-button">
      <Dropdown element={element} dropdownOptions={dropdownOptions} ></Dropdown>
    </buton>
    
    <Modal active={showModal} onClose={() => setShowModal(false)} onConfirmation={modalInfo.onConfirmation} title={modalInfo.title}>
      {modalInfo.content}
    </Modal>
  </div>
}