import './index.scss'
import { useState } from 'react'
import { useForm } from "react-hook-form";
import { Link, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { saveToken } from '../../store/actions/sessionActions'
import { updateUser } from '../../store/actions/userActions'
import { updateAlert } from '../../store/actions/systemActions'
import { login } from '../../services/auth'

import { ReactComponent as UserIcon } from '../../assets/icons/user.svg'
import { ReactComponent as LockIcon } from '../../assets/icons/lock.svg'
import { ReactComponent as EyeIcon } from '../../assets/icons/eye.svg'
import Logo from '../../assets/img/logo.png'

export default function Login() {
  const history = useHistory()
  const dispatch = useDispatch()
  const { register, formState: { errors }, handleSubmit } = useForm()

  const [showPassword, setShowPassword] = useState(false)

  const emailValidations = {
    required: 'Esse campo é obrigatorio!'
  }
  const passwordValidations = {
    required: 'Esse campo é obrigatório!'
  }

  const onSubmit = async (data) => {
    // console.log(data);

    let { email, password } = data
    const result = await login(email, password)
    if (!result) return dispatch(updateAlert({
      isActive: true,
      message: 'Ocorreu algo inesperado. Tente novamente mais tarde.',
      title: 'Erro'
    }))

    if (result.success) {
      dispatch(saveToken(result.data.token))
      dispatch(updateUser(result.data.user))
      history.push('/user')
    } else {
      return dispatch(updateAlert({
        isActive: true,
        message: result.feedback || 'Ocorreu algo inesperado. Tente novamente mais tarde.',
        title: 'Erro'
      }))
    }
  }

  return <div className="login-page">
      <div className="login-panel pt-6 is-flex is-flex-direction-column is-align-items-center">
      <Link className="figure my-6" to="/">
        <img className="image" src={Logo} alt="logo" width="170"></img>
      </Link>

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        
        <div className="field">
          <div className="control has-icons-left">
            <input type="email"
              className={`input ${errors.email && 'is-danger'}`}
              placeholder="Email"
              {...register('email', emailValidations)}  
            />
            <span className="icon is-small is-left">
              <UserIcon width={20}/>
            </span>
            {errors.email && <p className="help is-danger">{errors.email.message}</p>}
          </div>
        </div>

        <div className="field mt-4 has-addons">
          <div className="control is-expanded has-icons-left">
            <input type={showPassword ? 'text' : 'password'}
              className={`input ${errors.password && 'is-danger'}`}
              placeholder="Senha"
              {...register('password', passwordValidations)}  
            />
            <span className="icon is-small is-left">
              <LockIcon width={20}/>
            </span>
            {errors.password && <p className="help is-danger">{errors.password.message}</p>}
          </div>
          <div className="control">
            <button type="button" className="button" onClick={() => setShowPassword(!showPassword)}>
              <span className="icon is-small">
                <EyeIcon width={20} color={showPassword ? '#aaa' : '#333' }/>
              </span>
            </button>
          </div>
        </div>

        <div className="field mt-4">
          <div className="control">
            <button type="submit" className="button is-fullwidth is-info">ENTRAR</button>
          </div>
        </div>

        <div className="control mt-5 is-flex is-justify-content-space-between">
          <Link to="" className="is-size-7-mobile">Esqueceu a senha?</Link>
          <Link to="/signUp/0" className="is-size-7-mobile">Cadastre-se →</Link>
        </div>

      </form>
    </div>
  </div>
}