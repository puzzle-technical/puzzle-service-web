import './index.css'

export default function Button(props) {
  let { onClick, title, full } = props

  return <button className={`button ${full && 'full'}`} onClick={onClick}>{title}</button>
}