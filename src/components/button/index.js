import './index.css'

export default function Button(props) {
  let { onClick, title, full, type = 'button' } = props

  return <button type={type} className={`button ${full && 'full'}`} onClick={onClick}>{title}</button>
}