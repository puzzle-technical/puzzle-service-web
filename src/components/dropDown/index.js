import './index.css'
import { useState } from 'react'

export default function Dropdown (props) {
  const { element, dropdownOptions, position = 'down', justifyContent = 'flex-end', size = 25, textAlign } = props
  const [showOptions, setShowOptions] = useState(false)
  const [menuRef, setMenuRef] = useState()

  const getStyle = () => {
    switch (position) {
      case 'up': 
        return {
          justifyContent,
          alignItems: 'flex-end',
          marginTop: -size - 10
        }
      case 'down':
      default: 
        return {
          justifyContent,
          alignItems: 'flex-start',
          marginTop: size + 10
        }
    }
  }

  const showMenu = (event) => {
    event.preventDefault()
    let value = !showOptions
    setShowOptions(value)
    document.addEventListener('click', closeMenu)
  }

  const closeMenu = (event) => {
    if (!menuRef.contains(event.target)) {
      setShowOptions(false)
      document.removeEventListener('click', closeMenu)
    }
  }

  return <div className="dropdown" onClick={showMenu} ref={el => setMenuRef(el)}>
    <div >
      {element}
    </div>
    { showOptions &&
      <div className="dropdown-options-wrapper" style={getStyle()}>
        <div className="dropdown-options">
          {
            dropdownOptions.map((el, id) => {
              return <div key={id} className="dropdown-option" onClick={() => setShowOptions(false)} style={{ textAlign }}>{el}</div>
            })
          }
        </div>
      </div>  
    }
  </div>
}