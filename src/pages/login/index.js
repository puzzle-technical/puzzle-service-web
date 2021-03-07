import './index.css'

import { Link } from 'react-router-dom'

import { useState } from 'react'
import IconInput from '../../components/iconInput'
import Button from '../../components/button'

import { ReactComponent as UserIcon } from '../../assets/icons/user.svg'
import { ReactComponent as LockIcon } from '../../assets/icons/lock.svg'
import { ReactComponent as EyeIcon } from '../../assets/icons/eye.svg'
import Logo from '../../assets/img/logo.png'

export default function Login() {

  var [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return <div className="login-page">
    <div className="login-wrapper">
      <a href="/">
        <img className="login-logo" src={Logo} alt="logo" height={100}></img>
      </a>
      <form className="login-form">
        <div className="login-field">
          <IconInput type="text" placeholder="Email"
            left={<UserIcon width={20} color="#333"/>}>
          </IconInput>
        </div>
        <div className="login-field">
          <IconInput type={showPassword ? 'text' : 'password'}
            placeholder="Senha"
            left={<LockIcon width={20} color="#333"/>}
            right={
              <button className="button-simple" type="button" onClick={toggleShowPassword}>
                <EyeIcon width={20} color={showPassword ? '#333' : '#aaa'}/>
              </button>
            }>
          </IconInput>
        </div>
        <div className="login-field">
          <Link to="/auth"><Button title="ENTRAR" full></Button></Link>
        </div>
        <div className="login-field">
          <div className="login-alternative">
            <Link to="" className="login-alternative-link">Esqueceu a senha?</Link>
            <Link to="" className="login-alternative-link">Cadastre-se →</Link>
          </div>
        </div>
      </form>
    </div>
  </div>
}