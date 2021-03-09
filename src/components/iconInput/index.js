import './index.css'

export default function Input(params) {
  const { type, placeholder, value, onChange, left, right } = params

  return <div className="icon-input">
    <div className="icon-input-left">{left}</div>
    <input className="icon-input-input" required placeholder={placeholder}
    type={type} value={value} onChange={onChange}></input>
    <div className="icon-input-right">{right}</div>
  </div>
}