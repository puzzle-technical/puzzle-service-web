import './index.css'
import { useState } from "react"

export default function UploadImage (props) {
  const { imgSrc, onInput } = props

  const [imgUrl, setImageUrl] = useState(imgSrc)
  const [input, setinput] = useState()
  
  const triggerInput = () => {
    input.click()
  }
  const handleInput = e => {
    let file = e.target.files[0]
    if (!file) return
    setImageUrl(URL.createObjectURL(file))
    if (onInput) {
      onInput(file)
    }
  }

  return <div className="upload-image-wrapper">
    <div className="upload-image">
      <input ref={e => setinput(e)} className="upload-image-input" type="file" onInput={handleInput} accept="image/*"></input>
      <div className="upload-image-preview" style={{ backgroundImage: `url(${imgUrl})` }}></div>
    </div>
    <button type="button" className="button" onClick={triggerInput}>Enviar foto</button>
  </div>
}