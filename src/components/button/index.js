import './index.css'

export default function Button(props) {
  let { action, title } = props

  return <button className="button" onClick={action}>{title}</button>
}