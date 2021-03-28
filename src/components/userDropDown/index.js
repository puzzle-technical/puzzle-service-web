import './index.css'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { getUser } from '../../store/selectors/userSelectors'

import DefaultAvatar from '../../assets/img/defaultAvatar.png'

export default function UserDropDown (props) {
  const { dropdownOptions, position = 'down', justifyContent = 'flex-end', size = 40, textAlign } = props
  const user = useSelector(getUser)
  const [showOptions, setShowOptions] = useState(false)
  const [menuRef, setMenuRef] = useState()

  const imgSrc = user.avatar || DefaultAvatar

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
    setShowOptions(true)
    document.addEventListener('click', closeMenu)
  }

  const closeMenu = (event) => {
    if (!menuRef.contains(event.target)) {
      setShowOptions(false)
      document.removeEventListener('click', closeMenu)
    }
  }

  return <div className="user-dropdown" ref={el => setMenuRef(el)}>
    <button className="user-dropdown-button" onClick={showMenu} style={{ backgroundImage: `url(${imgSrc})` }}></button>
    { showOptions &&
      <div className="user-dropdown-options-wrapper" style={getStyle()}>
        <div className="user-dropdown-options">
          {
            dropdownOptions.map(el => {
              return <div className="user-dropdown-option" style={{ textAlign }}>{el}</div>
            })
          }
        </div>
      </div>  
    }
  </div>
}