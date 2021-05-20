import './index.scss'
import { useState } from 'react'

export default function Tooltip (props) {
  const { children, justifyContent, alignItems } = props
  const [active, setActive] = useState(false)

  return <div className={`tooltip ${active ? 'active' : ''}`} onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}>
    <div className="tooltip-content" style={{ display: 'flex', justifyContent, alignItems }}>
      {children}
    </div>
  </div>
}