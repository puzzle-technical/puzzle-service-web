import './index.scss'
import { useDispatch, useSelector } from 'react-redux'
import { updateAlert } from '../../store/actions/systemActions'
import { alertInfo } from '../../store/selectors/systemSelectors'

export default function Alert () {
  const dispatch = useDispatch()
  const alert = useSelector(alertInfo)
  const { isActive, message, title, cancelButton, okButton, confirmationCallback } = alert

  const close = () => {
    dispatch(updateAlert({ isActive: false }))
  }

  const confirm = () => {
    close()
    if (typeof confirmationCallback == 'function') confirmationCallback()
  }

  return <div className={`alert modal ${isActive ? 'is-active' : ''}`}>
    <div className="modal-background" onClick={close}></div>
    <div className="modal-content">
    <article className="message">
      <div className="message-header">
        <p className="has-text-dark">{title}</p>
        <button className="delete" aria-label="delete" onClick={close}></button>
      </div>
      <div className="message-body">
        <div className="block">
          {message}
        </div>
        <div className="is-flex is-justify-content-flex-end">
          {confirmationCallback ? <button className="button is-light" onClick={close}>{cancelButton}</button> : ''}
          <button className="button is-light ml-2" onClick={confirm}>{okButton}</button>
        </div>
      </div>
    </article>
    </div>
  </div>
}