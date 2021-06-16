import './index.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'
import api from '../../api'
import { ReactComponent as BellIcon } from '../../assets/icons/bell.svg'
import moment from 'moment'

export default function Notifications(props) {
  const user = useSelector(getUser)
  const [active, setactive] = useState()
  const [notifications, setnotifications] = useState([])

  const markAsSeen = async (index) => {
    await api.put(`notifications/update/${notifications[index].idNotification}`, { status: 'visto' })
    .then(res => {
      console.log(res)
    })
    .catch(err => console.log(err))
    
    let newNotifications = [...notifications]
    newNotifications[index].status = 'visto'
    setnotifications(newNotifications)
  }

  const markAll = async (status) => {
    if (status == 'visto') {
      let not = [...notifications]
      not.map(el => el.status = 'visto')
      setnotifications(not)
    }
    if (status == 'inativo') setnotifications([])
    
    await Promise.all(notifications.map(el => {
      return api.put(`notifications/update/${el.idNotification}`, { status })
      .then(res => {
        console.log(res)
      })
      .catch(err => console.log(err))
    }))
  }

  useEffect(() => {
    const load = async () => {
      await api
        .get(`notifications/findByUser/${user.idUser}`)
        .then((res) => {
          console.log(res.data)
          setnotifications(res.data.data)
        })
        .catch((err) => console.log(err))
    }
    load()
  }, [])

  const notSeenCount = notifications.filter(el => el.status == 'pendente').length
  const badge = notSeenCount > 0
    ? <span className="notification-badge">
        {notSeenCount}
      </span>
    : ''
    
  return (
    <div>
      <div onClick={() => setactive(!active)}>
        
      <span className='option'>
        <BellIcon width={20} height={20} color='inherit' />
        <span> Notificações</span>
        {badge}
      </span>
      </div>
      {active && (
        <div className='notifications'>
          <p className="notifications-title">Notificações {badge}</p>
          <div className="notifications-wrapper">
            {notifications?.length
              ? notifications.map((el, i) => {
                return (
                  <div key={i} className={`notification ${el.status === 'pendente' && 'pendente'}`} onClick={() => markAsSeen(i)}>
                    <div className="notification-message">
                      <div>{el.message}</div>
                      <div className="notification-date">{moment(el.data).format('DD/MM/YYYY [às] hh:mm:ss')}</div>
                    </div>
                      {el.status === 'pendente' ? <div className="notification-dot"/> : ''}
                  </div>
                )
              })
              : <div className="notification-no-message">Sem notificações</div>
            }
          </div>
          <div className="notifications-bottom">
            <span className="option" onClick={() => markAll('visto')}>Marcar todas como lidas</span>
            <span className="option" onClick={() => markAll('inativo')}>Limpar</span>
          </div>
        </div>
      )}
    </div>
  )
}
