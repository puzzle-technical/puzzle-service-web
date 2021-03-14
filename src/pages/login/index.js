import './index.css'

import { Link, useHistory } from 'react-router-dom'

import { login } from '../../services/auth'

import { useState } from 'react'
import IconInput from '../../components/iconInput'
import Button from '../../components/button'

import { ReactComponent as UserIcon } from '../../assets/icons/user.svg'
import { ReactComponent as LockIcon } from '../../assets/icons/lock.svg'
import { ReactComponent as EyeIcon } from '../../assets/icons/eye.svg'
import Logo from '../../assets/img/logo.png'

export default function Login() {

  var [showPassword, setShowPassword] = useState(false)
  var [email, setEmail] = useState('')
  var [password, setPassword] = useState('')
  var [feedback, setFeedback] = useState('')

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const history = useHistory()

  const userLogin = async event => {
    event.preventDefault()
    console.log(email, password)
    const result = await login(email, password)
    console.log(result)
    if (result.data) {
      history.push('/auth')
    } else {
      setFeedback(result.feedback)
      setTimeout(() => {
        setFeedback('')
      }, 3000);
      setPassword('')
      setEmail('')
    }
  }

  return <div className="login-page">
    <div className="login-wrapper">
      <a href="/">
        <img className="login-logo" src={Logo} alt="logo" height={100}></img>
      </a>
      <form className="login-form" onSubmit={userLogin}>
        <div className="login-field">
          <IconInput type="text" 
            centralize
            textAlign="center"
            placeholder="Email" 
            value={email} onChange={e => setEmail(e.target.value)}
            left={<UserIcon width={20} color="#333"/>}>
          </IconInput>
        </div>
        <div className="login-field">
          <IconInput type={showPassword ? 'text' : 'password'}
            placeholder="Senha"
            centralize
            textAlign="center"
            value={password} onChange={e => setPassword(e.target.value)}
            left={<LockIcon width={20} color="#333"/>}
            right={
              <button className="button-simple" type="button" onClick={toggleShowPassword}>
                <EyeIcon width={20} color={showPassword ? '#333' : '#aaa'}/>
              </button>
            }>
          </IconInput>
        </div>
        <p className="feedback">{feedback}</p>
        <div className="login-field">
          <Button type='submit' title="ENTRAR" full></Button>
        </div>
        <div className="login-field">
          <div className="login-alternative">
            <Link to="" className="login-alternative-link">Esqueceu a senha?</Link>
            <Link to="/signUp/0" className="login-alternative-link">Cadastre-se →</Link>
          </div>
        </div>
      </form>
    </div>
  </div>
}