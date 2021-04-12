import './index.css'
import React from 'react'
import puzzlePoint from '../../assets/img/puzzlePoint.png'

export default function ServiceBox (props) {
  const { service, onSelectService } = props
  const { nome, descricao, dataPublic, location, subcategories, user  } = service
  const price = 10

  const userInfo = () => {
    if (!user) return <p></p>
    let { nome, email, celular } = user
    let fnome = nome?.split(' ')[0]
    
    let mailsplit = email?.split('@')
    let femail = mailsplit && mailsplit.length && mailsplit[0].slice(0, 2) + mailsplit[0].slice(2).replaceAll(/./g, '*') + '@' + mailsplit[1].split('.')[0].replaceAll(/./g, '*') + '.' + mailsplit[1].split('.')[1]

    let fcelular = celular.slice(0, celular.length - 4) + celular.slice(celular.length - 4).replaceAll(/./g, '*')

    return <div>
      <p>{fnome}</p>
      <p>{femail}</p>
      <p>{fcelular}</p>
    </div>
  }

  return <div className="service-box">
    <div className="service-box-info">
      <div className="service-box-header">
        <div>
          <h4 className="service-box-title">{nome}</h4>
          <p className="service-box-adress">{location?.bairro} - {location?.cidade}</p>
        </div>
        <p className="service-box-date">{(new Date(dataPublic)).toLocaleString()}</p>
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
      <div className="service-box-user-info">
        {userInfo()}
      </div>
      <button type="button" onClick={onSelectService} className="service-box-user-button">
        <span>VER {price}</span>
        <img src={puzzlePoint} alt="puzzle points" width="20px"></img>
      </button>
    </div>
  </div>
}