import './index.scss'
import { cloneElement, Children, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/img/logo.png'

export default function Navbar(props) {
  const { children } = props
  const [menuActive, setMenuActive] = useState(false)

  return <div className="navbar-wrapper">
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          <img src={Logo} alt="logo" />
        </Link>

        <button className={`navbar-burger ${menuActive ? 'is-active' : ''}`} onClick={() => setMenuActive(!menuActive)}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div className={`navbar-menu ${menuActive ? 'is-active' : ''}`}>
        <div className="navbar-end has-text-centered-mobile">
          {Children.map(children, (child, index) => {
            return cloneElement(child, { onClick: () => { setMenuActive(false) } })
          })}
        </div>
      </div>
    </nav>
  </div>
}