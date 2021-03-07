import './index.css'

import Logo from '../../assets/img/logo.png'

export default function Navbar(props) {
  let { menuOptions } = props

  return <div className="navbar">
    <a href="/">
      <img src={Logo} alt="logo" height={55}></img>
    </a>
    <div className="menu">
      {menuOptions && menuOptions.map((el, index) => {
        return <span key={index}>{el}</span>
      })}
    </div>
  </div>
}