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
    onInput(e)
  }

  return <div className="upload-image" onClick={triggerInput}>
    <input ref={e => setinput(e)} className="upload-image-input" type="file" onInput={handleInput} accept="image/*"></input>
    <div className="upload-image-preview" style={{ backgroundImage: `url(${imgUrl})` }}></div>
    <button className="upload-image-button">Alterar</button>
  </div>
}