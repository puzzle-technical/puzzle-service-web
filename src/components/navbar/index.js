import './index.scss'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/img/logo.png'

export default function Navbar(props) {
  const { options } = props
  const [menuActive, setmenuActive] = useState(false)

  return <div className="navbar-wrapper">
  <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
      <a className="navbar-item" href="/">
        <img src={Logo} alt="logo"/>
      </a>

      <button className={`navbar-burger ${menuActive ? 'is-active' : ''}`} onClick={() => setmenuActive(!menuActive)}>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>
    </div>

    <div className={`navbar-menu ${menuActive ? 'is-active' : ''}`}>
      <div className="navbar-end">
        {
          options && options.map((option, index) => {
            return <div className="navbar-item" key={index}>
              <Link to="/">{option}</Link>
            </div>
          })
        }
      </div>
    </div>
</nav>
  </div>
}