import './index.css'

export default function Input(params) {
  const { type, placeholder, value, onChange, left, right, textAlign, centralize, borderless } = params

  return <div className={`icon-input ${centralize ? 'grid' : ''} ${borderless ? 'borderless': ''}`}>
    {left && <div className="icon-input-left">{left}</div>}
    <input className="icon-input-input" style={{ textAlign: textAlign }} required placeholder={placeholder}
    type={type} value={value} onChange={onChange}></input>
    {right && <div className="icon-input-right">{right}</div>}
  </div>
}