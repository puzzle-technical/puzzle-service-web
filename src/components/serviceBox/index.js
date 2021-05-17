import './index.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'
import api from '../../api'
import Modal from '../../components/modal'

import puzzlePoint from '../../assets/img/puzzlePoint.png'
import defaultAvatar from '../../assets/img/defaultAvatar.png'

export default function ServiceBox (props) {
  const { service, onSelectService, servicePoints } = props
  const { nome, descricao, dataPublic, location, subcategories, user } = service

  const userInfo = (() => {
    if (!user) return <p></p>
    let { nome, email, celular, avatar } = user
    let imgSrc = avatar || defaultAvatar
    let fnome = nome?.split(' ')[0] + ' ' + nome?.split(' ')[1].replaceAll(/./g, '*')
    
    let mailsplit = email?.split('@')
    let femail = mailsplit && mailsplit.length && mailsplit[0].slice(0, 2) + mailsplit[0].slice(2).replaceAll(/./g, '*') + '@' + mailsplit[1].split('.')[0].replaceAll(/./g, '*') + '.' + mailsplit[1].split('.')[1]

    let fcelular = celular.slice(0, celular.length - 4) + celular.slice(celular.length - 4).replaceAll(/./g, '*')

    return <div className="service-box-user-info">
      <div className="service-box-user-avatar" style={{ backgroundImage: `url(${imgSrc})`}}></div>
      <div>
        <p>{fnome}</p>
        <p>{femail}</p>
        <p>{fcelular}</p>
      </div>
    </div>
  })()

  return <div className="service-box">
    <div className="service-box-info">
      <div className="service-box-header">
        <div>
          <h4 className="service-box-title">{nome}</h4>
          <span className="service-box-date">{(new Date(dataPublic)).toLocaleString()}</span>
        </div>
        <p className="service-box-adress">{location?.bairro} - {location?.cidade}</p>        
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
    <div className="service-box-user">
      {userInfo}
      <button type="button" onClick={() => onSelectService()} className="button service-box-user-button">
        <span>VER INFORMAÇÕES</span>
        { servicePoints &&
          <span className="service-box-price">{servicePoints} <img src={puzzlePoint} alt="puzzle points" width="20px"></img></span>
        }
      </button>
    </div>
  </div>
}