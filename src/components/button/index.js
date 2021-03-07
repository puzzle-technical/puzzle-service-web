import './index.css'

export default function Button(props) {
  let { action, title, full } = props

  return <button className={`button ${full && 'full'}`} onClick={action}>{title}</button>
}