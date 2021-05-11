import './index.css'
import { ReactComponent as TimesIcon } from '../../assets/icons/times.svg'

export default function Modal (props) {

  const { title, children, active, onClose, onConfirmation, actionTitle = 'OK' } = props

  const confirm = () => {
    onClose()
    onConfirmation()
  }

  return active ? <div className="modal-wrapper">
    <div className="modal">
      <div className="modal-header">
        <h1 className="modal-title">{title || (onConfirmation ? 'Confimação' : 'Alerta')}</h1>
        <button className="modal-close" onClick={onClose}>
          <TimesIcon width={15}/>
        </button>
      </div>
      <div className="modal-content">
        {children}
      </div>
      {onConfirmation ?
      <div className="modal-actions">
        <button className="modal-button" onClick={onClose}>Cancelar</button>
        <button className="modal-button active" onClick={confirm}>{actionTitle}</button>
      </div> :
      <div className="modal-actions">
        <button className="modal-button" onClick={onClose}>{actionTitle}</button>
      </div>
      }
    </div>
  </div>
  : <></>
}