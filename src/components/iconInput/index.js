import './index.css'

export default function Input(params) {
  const { type, placeholder, value, left, right } = params

  return <div className="icon-input">
    <div className="icon-input-left">{left}</div>
    <input className="icon-input-input" placeholder={placeholder} type={type} value={value}></input>
    <div className="icon-input-right">{right}</div>
  </div>
}