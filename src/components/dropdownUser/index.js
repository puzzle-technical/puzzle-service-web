import './index.scss'
import defaultAvatar from '../../assets/img/defaultAvatar.png'

export default function DropdownUser (props) {
  const { children, user } = props
  const { nome, avatar } = user || {}

  return <div className="navbar-item has-dropdown is-hoverable has-text-centered-mobile">
  <div className="navbar-link is-arrowless px-4 pt-4 is-flex is-justify-content-center">
    <figure className="image is-32x32">
      <img className="is-rounded" src={avatar || defaultAvatar} alt="avatar"></img>
    </figure>
    <span className="ml-3 is-hidden-desktop">{nome.split(' ').slice(0, 2).join(' ')}</span>
  </div>
  
  <div className="navbar-dropdown is-right">
    {children}
  </div>
</div>
}