import './index.scss'
import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { getUser } from '../../store/selectors/userSelectors'
import { updateAlert } from '../../store/actions/systemActions'
import Select from 'react-select'
import * as Validations from '../../utils/validations'

import UseTerms from './useTerms'
import Logo from '../../assets/img/logo.png'
import { ReactComponent as EyeIcon } from '../../assets/icons/eye.svg'
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg'
import { Field, Input } from './components'
import UploadImage from './uploadImage'


export default function UserForm(props) {
  const { type } = props
  const user = useSelector(getUser)
  const history = useHistory()
  const dispatch = useDispatch()
  const { register, getValues, setValue, formState: { errors }, handleSubmit } = useForm({ reValidateMode: 'onChange' })

  const [tipoUser, setTipoUser] = useState(user?.tipoUser)
  const [showPassword, setShowPassword] = useState(false)
  const [showSecondPassword, setShowSecondPassword] = useState(false)
  
  useEffect(() => {
    setTipoUser('2')
  }, [])

  const onSubmit = async (data) => {
    console.log(data);

    if (true) return dispatch(updateAlert({
      isActive: true,
      message: JSON.stringify(data),
      title: 'Erro'
    }))
  }

  const showUseTerms = () => {
    dispatch(updateAlert({
      isActive: true,
      message: <UseTerms/>,
      title: 'Termos de uso',
      confirmationCallback: () => {
        setValue('useTerms', true)
      }
    }))
  }

  const buscaCep = <div className="control">
    <button type="button" className="button has-border is-light">
      <span className="icon">
        <SearchIcon width={20}></SearchIcon>
      </span>
    </button>
  </div>

  const nomeField = <Field classes="mb-0" labelName="Nome">
    <Input type="text" 
      keyName="nome" register={register}
      errors={errors} validation={Validations.nome}></Input>
  </Field>

  const emailField = <Field classes="mb-0" labelName="Email">
    <Input type="email"
      keyName="email" register={register}
      errors={errors} validation={Validations.email}></Input>
  </Field>

  const senhaField = <Field classes="mb-0" labelName="Senha">
    <Input type="password"
      keyName="senha" register={register}
      errors={errors} validation={Validations.senha}></Input>
  </Field>

  const senhaConfirmadaField = <Field classes="mb-0" labelName="Confirmar senha">
    <Input type="password"
      keyName="senhaConfirmada" register={register}
      errors={errors} validation={Validations.senhaConfirmada}></Input>
  </Field>

  const cpfField = <Field classes="mb-0" labelName="CPF">
    <Input type="text"
      keyName="cpf" register={register}
      errors={errors} validation={Validations.cpf}></Input>
  </Field>

  const dataNascField = <Field classes="mb-0" labelName="Data de nascimento">
    <Input type="text"
      keyName="dataNasc" register={register}
      errors={errors} validation={Validations.dataNasc}></Input>
  </Field>

  const celularField = <Field classes="mb-0" labelName="Telefone">
    <Input type="text"
      keyName="celular" register={register}
      errors={errors} validation={Validations.celular}></Input>
  </Field>

  const cepField = <Field classes="mb-0 has-addons" labelName="CEP" addons={buscaCep}>
    <Input type="text"
      keyName="cep" register={register}
      errors={errors} validation={Validations.cep}></Input>
  </Field>

  const ufField = <Field classes="mb-0 has-addons" labelName="UF">
    <Select
        name="uf"
        placeholder=""
        noOptionsMessage={() => 'Sem ufs disponíveis'}
        onChange={() => {}}
        options={[{ value: 'AL', label: 'AL' }, { value: 'PE', label: 'PE' }]}
        className="basic-multi-select"
        classNamePrefix="select">
      </Select>
  </Field>

  const cidadeField = <Field classes="mb-0 has-addons" labelName="Cidade">
    <Input type="text"
      keyName="cidade" register={register}
      errors={errors} validation={Validations.cidade}></Input>
  </Field>

  const logradouroField = <Field classes="mb-0 has-addons" labelName="Logradouro">
    <Input type="text"
      keyName="logradouro" register={register}
      errors={errors} validation={Validations.logradouro}></Input>
  </Field>

  const numeroField = <Field classes="mb-0 has-addons" labelName="Nº">
    <Input type="text"
      keyName="numero" register={register}
      errors={errors} validation={Validations.numero}></Input>
  </Field>

  const complementoField = <Field classes="mb-0 has-addons" labelName="Complemento">
    <Input type="text"
      keyName="complemento" register={register}></Input>
  </Field>

  const bairroField = <Field classes="mb-0 has-addons" labelName="Bairro">
    <Input type="text"
      keyName="bairro" register={register}
      errors={errors} validation={Validations.bairro}></Input>
  </Field>

  const categoriesField = <Field classes="mb-0 has-addons" labelName="Categorias de atuação">
    <Select
      name="uf"
      placeholder=""
      noOptionsMessage={() => 'Sem ufs disponíveis'}
      onChange={() => {}}
      options={[{ value: 'AL', label: 'AL' }, { value: 'PE', label: 'PE' }]}
      className="basic-multi-select"
      classNamePrefix="select">
    </Select>
  </Field>

  const locationsField = <Field classes="mb-0 has-addons" labelName="Locais de atuação">
    <Select
      name="uf"
      placeholder=""
      noOptionsMessage={() => 'Sem ufs disponíveis'}
      onChange={() => {}}
      options={[{ value: 'AL', label: 'AL' }, { value: 'PE', label: 'PE' }]}
      className="basic-multi-select"
      classNamePrefix="select">
    </Select>
  </Field>

  const aditionalInfoField = <Field classes="mb-0 has-addons" labelName="Informações adicionais">
    <textarea class="textarea"></textarea>
  </Field>

  const useTermsField = <Field classes="is-narrow">
    <label class="checkbox">
      <input type="checkbox" {...register('useTerms')}/>
      <span className="ml-2">
        Li e concordo com os 
        <Link to="#" onClick={showUseTerms}> Termos de uso </Link>
        da Puzzle Service
      </span>
    </label>
  </Field>

  return <div className="signup-page">
    <form className="form" onSubmit={handleSubmit(onSubmit)}>

      <h2 className="subtitle is-5 mb-5">Preencha seus dados</h2>

      <div className="columns">
        {true && <div className="column is-narrow">
          <UploadImage></UploadImage>
        </div>}

        {type != 'signup'
        ? <div className="column">
            <div className="columns is-multiline">
              <div className="column is-half">
                {nomeField}
              </div>
              <div className="column is-half">
                {emailField}
              </div> 
              <div className="column is-4">
                {cpfField}
              </div>
              <div className="column is-4">
                {dataNascField}
              </div>
              <div className="column is-4">
                {celularField}
              </div>
            </div>
          </div>
        : <div className="column">
            <div className="columns is-multiline">
              <div className="column is-half">
                {nomeField}
              </div>
              <div className="column is-half">
                {emailField}
              </div>
              <div className="column is-half">
                {senhaField}
              </div>
              <div className="column is-half">
                {senhaConfirmadaField}
              </div>
            </div>
          </div>
        }
      </div>

        { type == 'signup' && <div className="columns">          
            <div className="column is-4">
              {cpfField}
            </div>
            <div className="column is-4">
              {dataNascField}
            </div>
            <div className="column is-4">
              {celularField}
            </div>
          </div>
        }
      
      <h2 className="subtitle is-5 my-5">Endereço</h2>

      <div className="columns is-multiline">
        <div className="column is-4">
          {cepField}
        </div>
        <div className="column is-2">
          {ufField}
        </div>
        <div className="column is-6">
          {cidadeField}
        </div>
        <div className="column is-full">
          {logradouroField}
        </div>
        <div className="column is-2">
          {numeroField}
        </div>
        <div className="column">
          {complementoField}
        </div>
        <div className="column">
          {bairroField}
        </div>
      </div>

      { tipoUser == '2' && <>
        <h2 className="subtitle is-5 my-5">Trabalho</h2>
        <div className="columns is-multiline">
          <div className="column is-full">
            {categoriesField}
          </div>
          <div className="column is-full">
            {locationsField}
          </div>
          <div className="column is-full">
            {aditionalInfoField}
          </div>
        </div>
      </>}

      { type == 'signup' &&
        <div className="columns is-centered my-4">
          {useTermsField}
        </div>
      }

      {/********** SUBMIT *************/}
      <div className="columns is-centered">
        <Field classes="column is-4">
          <button type="submit" className="input button is-info">
            {type == 'signup' ? 'FINALIZAR CADASTRO' : 'SALVAR ALTERAÇÕES'}
          </button>
        </Field>
      </div>

    </form>
  </div>
}